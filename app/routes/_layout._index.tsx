import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4 pt-8 md:px-[max(1rem,10vw)] md:py-[max(1rem,20vh)] flex flex-col gap-4 box-content">
      <h1 className="text-3xl w-full text-center text-gray-900 md:text-4xl lg:text-6xl">
        Coming soon!
      </h1>
      <p className="text-xl md:text-2xl w-full text-center text-gray-600">
        Check back soon to see our releases.
      </p>
    </div>
  );
}
