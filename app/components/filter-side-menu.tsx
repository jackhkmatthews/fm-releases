import { Form, Link, useLocation } from "@remix-run/react";
import { X } from "lucide-react";
import { HtmlHTMLAttributes } from "react";

import { TAGS } from "~/constants";
import { shellPaddingClasses } from "~/styles";
import { cn, updateSearchParams } from "~/utils";

export default function FilterSideMenu({ className, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  return (
    <div className={cn("border-r border-r-gray-300 bg-white", className)} {...rest}>
      <div className={cn("flex h-16 items-center border-b border-b-gray-300", shellPaddingClasses)}>
        <h2 className="flex-grow text-center text-2xl">Filters</h2>
        <Link
          to={{ search: updateSearchParams(location.search, { filterMenu: "closed" }).toString() }}
          preventScrollReset
          className="p-2"
        >
          <span className="sr-only">Close</span>
          <X />
        </Link>
      </div>
      <Form
        className={cn(shellPaddingClasses, "flex flex-col gap-8")}
        method="get"
        action={`${location.pathname}${location.search}`}
        preventScrollReset
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="py-3 text-lg">Tags</legend>

          {TAGS.map(tag => (
            <div key={tag.value} className="flex gap-2">
              <input type="checkbox" id={tag.value} name="tag" value={tag.value} />
              <label htmlFor={tag.value}>{tag.label}</label>
            </div>
          ))}
        </fieldset>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-gray-200 hover:text-white"
        >
          Apply filters
        </button>
      </Form>
    </div>
  );
}
