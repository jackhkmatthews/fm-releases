import { Form, Link, useSearchParams, useSubmit } from "@remix-run/react";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { HTMLAttributes, useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/select";
import { shellPaddingClasses } from "~/styles";
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
  limit,
  preventScrollReset = true,
  className,
  ...rest
}: {
  currentCursor?: string;
  nextCursor?: string;
  limit: string;
  preventScrollReset?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const [searchParams] = useSearchParams();
  const [previousCursors, setPreviousCursors] = useState<Array<string | undefined>>([]);
  const [selectLimit, setSelectLimit] = useState(limit);
  const submit = useSubmit();

  // TODO(jack.matthews): not sure about this
  // Need to coordinate two instances of this component with the params in the URL / from the loader
  // So need a change in limit prop to change the value of the select
  useEffect(() => {
    setSelectLimit(limit);
  }, [limit]);

  const previousCursor = previousCursors[previousCursors.length - 1];

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", shellPaddingClasses, className)} {...rest}>
      <Form
        preventScrollReset={preventScrollReset}
        onChange={event => {
          submit(event.currentTarget, { preventScrollReset: true });
        }}
      >
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
        {[...searchParams.entries()]
          .filter(([key]) => key !== "limit")
          .map(([key, value]) => (
            <input key={`${key}:${value}`} type="hidden" name={key} value={value} />
          ))}
      </Form>
      <div className="flex flex-nowrap items-center gap-2">
        {currentCursor ? (
          <Link
            className="p-1"
            preventScrollReset={preventScrollReset}
            onClick={() => setPreviousCursors([])}
            to={{ search: updateSearchParams(searchParams, { cursor: undefined }).toString() }}
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
            to={{ search: updateSearchParams(searchParams, { cursor: previousCursor }).toString() }}
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
            to={{ search: updateSearchParams(searchParams, { cursor: nextCursor }).toString() }}
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
