import { Form } from "@remix-run/react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/select";
import { shellPaddingClasses } from "~/shared/styles";
import { SortDirection } from "~/shared/types";
import { cn } from "~/shared/utils";

const SORT_OPTIONS = [
  {
    value: "asc",
    label: "Oldest first",
  },
  {
    value: "desc",
    label: "Newest first",
  },
];

export function Sorter({
  onSortChange,
  sortDirection,
  limit,
}: {
  sortDirection?: SortDirection;
  limit: string;
  onSortChange: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <Form className={cn(shellPaddingClasses)} onChange={onSortChange}>
      <label htmlFor="sortDirection">
        <span className="sr-only">Sort by:</span>
        <Select name="sortDirection" defaultValue={sortDirection}>
          <SelectTrigger id="sortDirection">
            {SORT_OPTIONS.find(option => option.value === sortDirection)?.label}
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <input name="limit" type="hidden" value={limit} />
    </Form>
  );
}
