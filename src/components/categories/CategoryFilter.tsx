"use client";

import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface CategoryType {
  id: string;
  name: string;
  subcategories?: { id: string; name: string; classification?: string }[];
}

interface CategoryFilterProps {
  categories: CategoryType[];
  compact?: boolean;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
  setSelectedSubcategory: Dispatch<SetStateAction<string | null>>;
}

export function CategoryFilter({
  categories,
  compact = false,
  selectedCategory,
  selectedSubcategory,
  setSelectedCategory,
  setSelectedSubcategory,
}: CategoryFilterProps) {
  if (compact) {
    return (
      <div className="space-y-3">
        <h3 className="font-medium text-base">หมวดหมู่</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`p-2 border rounded-md cursor-pointer text-sm ${
                selectedCategory === category.id ? "bg-green-100 border-green-500" : ""
              }`}
              onClick={() => {
                setSelectedCategory(selectedCategory === category.id ? null : category.id);
                setSelectedSubcategory(null);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        {selectedCategory &&
          categories.find((c) => c.id === selectedCategory)?.subcategories && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">หมวดหมู่ย่อย</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories
                  .find((c) => c.id === selectedCategory)
                  ?.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`p-2 border rounded-md cursor-pointer text-sm ${
                        selectedSubcategory === subcategory.id
                          ? "bg-green-100 border-green-500"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedSubcategory(
                          selectedSubcategory === subcategory.id ? null : subcategory.id
                        )
                      }
                    >
                      {subcategory.name}
                      {subcategory.classification && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({subcategory.classification})
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="category">
      <AccordionItem value="category">
        <AccordionTrigger className="text-base font-medium">หมวดหมู่</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategory === category.id}
                    onCheckedChange={(checked) => {
                      setSelectedCategory(checked ? category.id : null);
                      setSelectedSubcategory(null);
                    }}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
                {selectedCategory === category.id && category.subcategories && (
                  <div className="ml-6 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subcategory.id}
                          checked={selectedSubcategory === subcategory.id}
                          onCheckedChange={(checked) =>
                            setSelectedSubcategory(checked ? subcategory.id : null)
                          }
                        />
                        <label
                          htmlFor={subcategory.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subcategory.name}
                          {subcategory.classification && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({subcategory.classification})
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}