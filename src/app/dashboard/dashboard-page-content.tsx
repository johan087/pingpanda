"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const DashboardPageContent = () => {
  const { data: categories, isPending: isEventCategoriesLoading } = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const res = await client.category.getEventCategories.$get({});
      const { categories } = await res.json();
      return categories;
    },
  });
  if (isEventCategoriesLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categories || categories.length === 0) return <div></div>;

  return (
    <ul className="grid max-w-6xl cols-1 lg:grid-cols-2 xl:grid-col-3 gap-6">
      {categories?.map((category) => (
        <li
          key={category.id}
          className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="absolute z-0 inst-px rounded-lg bg-white" />
          <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5">
            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.color
                      ? `#${category.color.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />
                <div>
                  <h3 className="text-lgg/7 font-medium tracking-light text-gray-950">
                    {category.emoji || "📁"}
                    {category.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {format(category.createdAt, "MMM d, yyyy")}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
