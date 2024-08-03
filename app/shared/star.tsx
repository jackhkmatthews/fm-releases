import { SVGProps } from "react";

export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.209 2.64c1.302-3.52 6.28-3.52 7.582 0l.86 2.321a4.042 4.042 0 0 0 2.388 2.389l2.321.859c3.52 1.302 3.52 6.28 0 7.582l-2.321.86a4.042 4.042 0 0 0-2.389 2.388l-.859 2.321c-1.302 3.52-6.28 3.52-7.582 0l-.86-2.321a4.042 4.042 0 0 0-2.388-2.389l-2.321-.859c-3.52-1.302-3.52-6.28 0-7.582l2.321-.86A4.042 4.042 0 0 0 7.35 4.962l.859-2.321Z"
      />
    </svg>
  );
}
