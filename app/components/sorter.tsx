import { Form, useSearchParams } from "@remix-run/react";
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

// NOTE(jack.matthews): this component takes change and direction as props
// Not sure if in Remix this is the best way to handle this
// Maybe each component can handle it's own form submission and default from loader data
// Tension between keeping the data flow close to the route and keeping components reusable
export function Sorter({
  onSortChange,
  sortDirection,
  ...rest
}: {
  sortDirection?: SortDirection;
  onSortChange: React.FormEventHandler<HTMLFormElement>;
} & RemixFormProps) {
  const [searchParams] = useSearchParams();
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
      {[...searchParams.entries()]
        .filter(([key]) => key !== "sortDirection")
        .map(([key, value]) => (
          <input key={`${key}:${value}`} type="hidden" name={key} value={value} />
        ))}
    </Form>
  );
}
