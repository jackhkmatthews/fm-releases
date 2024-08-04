import { Link, useLocation } from "@remix-run/react";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { updateSearchParams } from "~/shared/utils";

export function Paginator({
  currentCursor,
  nextCursor,
}: {
  currentCursor?: string;
  nextCursor?: string;
}) {
  const location = useLocation();
  const [previousCursors, setPreviousCursors] = useState<
    Array<string | undefined>
  >([]);

  const previousCursor = previousCursors[previousCursors.length - 1];

  return (
    <div className="flex flex-nowrap gap-4 items-center">
      {currentCursor ? (
        <Link
          className="p-1"
          preventScrollReset
          onClick={() => setPreviousCursors([])}
          to={`${location.pathname}?${updateSearchParams(location.search, {
            cursor: undefined,
          }).toString()}`}
        >
          <ChevronFirst />
          <span className="sr-only">First page</span>
        </Link>
      ) : (
        <p className="text-gray-300 p-1">
          <ChevronFirst />
        </p>
      )}
      {currentCursor && previousCursors.length > 0 ? (
        <Link
          className="p-1"
          preventScrollReset
          onClick={() =>
            setPreviousCursors((previousCursors) =>
              previousCursors.slice(0, -1)
            )
          }
          to={`${location.pathname}?${updateSearchParams(location.search, {
            cursor: previousCursor,
          }).toString()}`}
        >
          <ChevronLeft />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : (
        <p className="text-gray-300 p-1">
          <ChevronLeft />
        </p>
      )}
      {nextCursor ? (
        <Link
          className="p-1"
          preventScrollReset
          onClick={() =>
            setPreviousCursors((previousCursors) => [
              ...previousCursors,
              currentCursor,
            ])
          }
          to={`${location.pathname}?${updateSearchParams(location.search, {
            cursor: nextCursor,
          }).toString()}`}
        >
          <ChevronRight />
          <span className="sr-only">Next page</span>
        </Link>
      ) : (
        <p className="text-gray-300 p-1">
          <ChevronRight />
        </p>
      )}
    </div>
  );
}
