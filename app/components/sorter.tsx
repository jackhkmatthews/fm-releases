import { Form } from "@remix-run/react";
import { RemixFormProps } from "@remix-run/react/dist/components";

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/select";
import { SortDirection } from "~/types";

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
  ...rest
}: {
  sortDirection?: SortDirection;
  onSortChange: React.FormEventHandler<HTMLFormElement>;
} & RemixFormProps) {
  return (
    <Form onChange={onSortChange} {...rest}>
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
    </Form>
  );
}
