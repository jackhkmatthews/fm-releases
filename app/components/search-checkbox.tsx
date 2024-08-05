import { useSearchParams } from "@remix-run/react";
import { HTMLAttributes, useEffect, useState } from "react";

import { cn } from "~/utils";

export function SearchCheckbox({
  name,
  value,
  label,
  className,
  ...rest
}: { name: string; value: string; label: string } & HTMLAttributes<HTMLDivElement>) {
  const [searchParams] = useSearchParams();
  const paramsIncludeValue = searchParams.getAll(name).includes(value);
  const [checked, setChecked] = useState(paramsIncludeValue);

  useEffect(() => {
    setChecked(paramsIncludeValue);
  }, [paramsIncludeValue]);

  return (
    <div key={value} className={cn("flex items-center gap-2", className)} {...rest}>
      <input
        type="checkbox"
        id={value}
        name="tag"
        value={value}
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
      />
      <label htmlFor={value}>{label}</label>
    </div>
  );
}
