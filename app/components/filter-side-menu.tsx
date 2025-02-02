import { Form, Link, useLocation } from "@remix-run/react";
import { X } from "lucide-react";
import { HtmlHTMLAttributes } from "react";

import { TAGS } from "~/constants";
import { CTAClasses } from "~/styles";
import { cn } from "~/utils";

import { SearchCheckbox } from "./search-checkbox";

export default function FilterSideMenu({ className, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <div className={cn("border-r border-r-gray-300 bg-white", className)} {...rest}>
      <div className={cn("flex h-16 items-center border-b border-b-gray-300 px-3 md:px-8")}>
        <h2 className="flex-grow text-left text-2xl">Filters</h2>
        <Link to={{ hash: "#", search: location.search }} preventScrollReset className={cn(CTAClasses)}>
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Link>
      </div>
      <Form className={cn("flex flex-col gap-8 px-3 md:px-8")} preventScrollReset>
        <fieldset className="flex flex-col gap-1">
          <legend className="pb-1 pt-5 text-lg">Tags</legend>
          {TAGS.map(tag => (
            <SearchCheckbox key={tag.value} name="tag" value={tag.value} label={tag.label} />
          ))}
        </fieldset>
        {[...searchParams.entries()]
          .filter(([key]) => key !== "tag")
          .filter(([key]) => key !== "cursor")
          .map(([key, value]) => (
            <input key={`${key}:${value}`} type="hidden" name={key} value={value} />
          ))}
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
