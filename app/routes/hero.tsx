import { twJoin } from "tailwind-merge";
import { shellPaddingClasses } from "~/shared/styles";

export function Hero() {
  return (
    <div
      className={twJoin(
        shellPaddingClasses,
        "bg-gray-950 flex flex-col pt-16 pb-10"
      )}
    >
      <h1 className="w-full text-gray-50 font-sans leading-tight text-[max(2rem,8cqw)] translate-x-[-0.1ch]">
        Fresh Meta Releases
      </h1>
      <p className="text-gray-300">
        A curated selection of books, films, music and art released on{" "}
        <a
          href="https://www.metalabel.com/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Metalabel
        </a>
        .
      </p>
    </div>
  );
}
