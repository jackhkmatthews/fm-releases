import { shellPaddingClasses } from "~/styles";
import { cn } from "~/utils";

export function Hero() {
  return (
    <div className={cn(shellPaddingClasses, "flex flex-col bg-gray-950 pb-10 pt-16")}>
      <h1 className="w-full translate-x-[-0.1ch] font-sans text-[max(2rem,8cqw)] leading-tight text-gray-50">
        Fresh Meta Releases
      </h1>
      <p className="text-gray-300">
        A curated selection of books, films, music and art released on{" "}
        <a href="https://www.metalabel.com/" className="underline" target="_blank" rel="noreferrer">
          Metalabel
        </a>
        .
      </p>
    </div>
  );
}
