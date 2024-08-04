import { Form, Link, useLocation } from "@remix-run/react";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { HTMLAttributes, useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/select";
import { shellPaddingClasses } from "~/styles";
import { SortDirection } from "~/types";
import { cn, updateSearchParams } from "~/utils";

const OPTIONS = [
  {
    value: "10",
    label: "10 releases per page",
  },
  {
    value: "20",
    label: "20 releases per page",
  },
  {
    value: "50",
    label: "50 releases per page",
  },
  {
    value: "100",
    label: "100 releases per page",
  },
];

export function Paginator({
  currentCursor,
  nextCursor,
  onLimitChange,
  limit,
  preventScrollReset = true,
  sortDirection,
  className,
  ...rest
}: {
  currentCursor?: string;
  nextCursor?: string;
  limit: string;
  onLimitChange: React.FormEventHandler<HTMLFormElement>;
  preventScrollReset?: boolean;
  sortDirection?: SortDirection;
} & HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const [previousCursors, setPreviousCursors] = useState<Array<string | undefined>>([]);
  const [selectLimit, setSelectLimit] = useState(limit);

  // TODO(jack.matthews): not sure about this
  // Need to coordinate two instances of this component with the params in the URL / from the loader
  // So need a change in limit prop to change the value of the select
  useEffect(() => {
    setSelectLimit(limit);
  }, [limit]);

  const previousCursor = previousCursors[previousCursors.length - 1];

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", shellPaddingClasses, className)} {...rest}>
      <Form onChange={onLimitChange}>
        <label htmlFor="limit">
          <span className="sr-only">Releases per page:</span>
          <Select name="limit" value={selectLimit} onValueChange={setSelectLimit}>
            <SelectTrigger id="limit">{OPTIONS.find(option => option.value === selectLimit)?.label}</SelectTrigger>
            <SelectContent>
              {OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <input name="sortDirection" type="hidden" value={sortDirection} />
      </Form>
      <div className="flex flex-nowrap items-center gap-2">
        {currentCursor ? (
          <Link
            className="p-1"
            preventScrollReset={preventScrollReset}
            onClick={() => setPreviousCursors([])}
            to={`${location.pathname}?${updateSearchParams(location.search, {
              cursor: undefined,
            }).toString()}`}
          >
            <ChevronFirst />
            <span className="sr-only">First page</span>
          </Link>
        ) : (
          <p className="p-1 text-gray-300">
            <ChevronFirst />
          </p>
        )}
        {currentCursor && previousCursors.length > 0 ? (
          <Link
            className="p-1"
            preventScrollReset={preventScrollReset}
            onClick={() => setPreviousCursors(previousCursors => previousCursors.slice(0, -1))}
            to={`${location.pathname}?${updateSearchParams(location.search, {
              cursor: previousCursor,
            }).toString()}`}
          >
            <ChevronLeft />
            <span className="sr-only">Previous page</span>
          </Link>
        ) : (
          <p className="p-1 text-gray-300">
            <ChevronLeft />
          </p>
        )}
        {nextCursor ? (
          <Link
            className="p-1"
            preventScrollReset={preventScrollReset}
            onClick={() => setPreviousCursors(previousCursors => [...previousCursors, currentCursor])}
            to={`${location.pathname}?${updateSearchParams(location.search, {
              cursor: nextCursor,
            }).toString()}`}
          >
            <ChevronRight />
            <span className="sr-only">Next page</span>
          </Link>
        ) : (
          <p className="p-1 text-gray-300">
            <ChevronRight />
          </p>
        )}
      </div>
    </div>
  );
}
