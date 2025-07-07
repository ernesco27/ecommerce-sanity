// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { Skeleton } from "@mui/material";
// import { useRouter, useSearchParams } from "next/navigation";
// import { remove } from "lodash";
// import { formUrlQuery, removeKeysFromUrl } from "@/lib/url";

// interface SubCategory {
//   _id: string;
//   name: string;
//   slug: string;
// }

// interface Category {
//   _id: string;
//   title: string;
//   slug: string;
//   subcategories: SubCategory[];
// }

// interface ProductsCatAccordionProps {
//   selectedCategories: string[];
//   onCategoryChange: (categories: string[]) => void;
// }

// const ProductsCatAccordion = ({
//   //selectedCategories,
//   onCategoryChange,
// }: ProductsCatAccordionProps) => {
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const searchParams = useSearchParams();
//   const filterFromUrl = searchParams.get("filter") || "";

//   const [selectedCategories, setSelectedCategories] = useState<string[]>(
//     filterFromUrl ? filterFromUrl.split(",") : [],
//   );

//   const router = useRouter();

//   // const handleCategoryClick = (categorySlug: string, parentSlug?: string) => {
//   //   let newSelectedCategories: string[];

//   //   if (selectedCategories.includes(categorySlug)) {
//   //     // If unchecking a main category, remove it and all its subcategories
//   //     if (!parentSlug) {
//   //       const category = categories.find((c) => c.slug === categorySlug);
//   //       const subCategoryIds =
//   //         category?.subcategories.map((sub) => sub.slug) || [];
//   //       newSelectedCategories = selectedCategories.filter(
//   //         (slug) => slug !== categorySlug && !subCategoryIds.includes(slug),
//   //       );
//   //     } else {
//   //       // // If unchecking a subcategory, just remove it
//   //       // newSelectedCategories = selectedCategories.filter(
//   //       //   (slug) => slug !== categorySlug,
//   //       // );

//   //       newSelectedCategories = selectedCategories.filter(
//   //         (slug) => slug !== categorySlug,
//   //       );
//   //       // If no other subcategories of the parent are selected, remove the parent too
//   //       const parentCategory = categories.find((c) => c.slug === parentSlug);
//   //       const siblingIds =
//   //         parentCategory?.subcategories.map((sub) => sub.slug) || [];
//   //       const hasSelectedSiblings = siblingIds.some(
//   //         (slug) =>
//   //           slug !== categorySlug && newSelectedCategories.includes(slug),
//   //       );
//   //       if (!hasSelectedSiblings) {
//   //         newSelectedCategories = newSelectedCategories.filter(
//   //           (slug) => slug !== parentSlug,
//   //         );
//   //       }
//   //     }
//   //   } else {
//   //     // If checking a main category, add it and all its subcategories
//   //     if (!parentSlug) {
//   //       const category = categories.find((c) => c.slug === categorySlug);
//   //       const subCategoryIds =
//   //         category?.subcategories.map((sub) => sub.slug) || [];
//   //       newSelectedCategories = [
//   //         ...selectedCategories,
//   //         categorySlug,
//   //         ...subCategoryIds,
//   //       ];
//   //     } else {
//   //       // If checking a subcategory, add it and its parent
//   //       newSelectedCategories = [...selectedCategories, categorySlug];
//   //       if (!selectedCategories.includes(parentSlug)) {
//   //         newSelectedCategories.push(parentSlug);
//   //       }
//   //     }
//   //   }

//   //   const finalCategories = [...new Set(newSelectedCategories)];
//   //   setSelectedCategories(finalCategories);

//   //   //setSelectedCategories([...new Set(newSelectedCategories)]);
//   //   // onCategoryChange([...new Set(newSelectedCategories)]);

//   //   // URL logic (optional)

//   //   const newFilterValue = finalCategories.join(",");
//   //   let newUrl = "";
//   //   if (newFilterValue) {
//   //     // If there are any selected categories, update the 'filter' param
//   //     newUrl = formUrlQuery({
//   //       params: searchParams.toString(),
//   //       key: "filter",
//   //       value: newFilterValue,
//   //     });
//   //   } else {
//   //     // If no categories are selected, remove the 'filter' param entirely
//   //     newUrl = removeKeysFromUrl({
//   //       params: searchParams.toString(),
//   //       keysToRemove: ["filter"],
//   //     });
//   //   }
//   //   router.push(newUrl, { scroll: false });
//   // };

//   // const toggleCategory = (categoryId: string, parentId?: string) => {
//   //   let newSelectedCategories: string[];

//   //   if (selectedCategories.includes(categoryId)) {
//   //     // If unchecking a main category, remove it and all its subcategories
//   //     if (!parentId) {
//   //       const category = categories.find((c) => c._id === categoryId);
//   //       const subCategoryIds =
//   //         category?.subcategories.map((sub) => sub._id) || [];
//   //       newSelectedCategories = selectedCategories.filter(
//   //         (id) => id !== categoryId && !subCategoryIds.includes(id),
//   //       );
//   //     } else {
//   //       // If unchecking a subcategory, just remove it
//   //       newSelectedCategories = selectedCategories.filter(
//   //         (id) => id !== categoryId,
//   //       );
//   //       // If no other subcategories of the parent are selected, remove the parent too
//   //       const parentCategory = categories.find((c) => c._id === parentId);
//   //       const siblingIds =
//   //         parentCategory?.subcategories.map((sub) => sub._id) || [];
//   //       const hasSelectedSiblings = siblingIds.some(
//   //         (id) => id !== categoryId && newSelectedCategories.includes(id),
//   //       );
//   //       if (!hasSelectedSiblings) {
//   //         newSelectedCategories = newSelectedCategories.filter(
//   //           (id) => id !== parentId,
//   //         );
//   //       }
//   //     }
//   //   } else {
//   //     // If checking a main category, add it and all its subcategories
//   //     if (!parentId) {
//   //       const category = categories.find((c) => c._id === categoryId);
//   //       const subCategoryIds =
//   //         category?.subcategories.map((sub) => sub._id) || [];
//   //       newSelectedCategories = [
//   //         ...selectedCategories,
//   //         categoryId,
//   //         ...subCategoryIds,
//   //       ];
//   //     } else {
//   //       // If checking a subcategory, add it and its parent
//   //       newSelectedCategories = [...selectedCategories, categoryId];
//   //       if (!selectedCategories.includes(parentId)) {
//   //         newSelectedCategories.push(parentId);
//   //       }
//   //     }
//   //   }

//   //   onCategoryChange([...new Set(newSelectedCategories)]);
//   // };

//   const handleCategoryClick = (categorySlug: string, parentSlug?: string) => {
//     let newSelectedCategories: string[];

//     if (selectedCategories.includes(categorySlug)) {
//       // UNCHECKING LOGIC
//       if (!parentSlug) {
//         // If unchecking a main category, remove it and all its subcategories
//         const category = categories.find((c) => c.slug === categorySlug);
//         const subCategorySlugs =
//           category?.subcategories.map((sub) => sub.slug) || [];
//         newSelectedCategories = selectedCategories.filter(
//           (slug) => slug !== categorySlug && !subCategorySlugs.includes(slug),
//         );
//       } else {
//         // If unchecking a subcategory, just remove it
//         newSelectedCategories = selectedCategories.filter(
//           (slug) => slug !== categorySlug,
//         );
//         // If no other subcategories of the parent are selected, remove the parent too
//         const parentCategory = categories.find((c) => c.slug === parentSlug);
//         const hasSelectedSiblings = parentCategory?.subcategories.some((sub) =>
//           newSelectedCategories.includes(sub.slug),
//         );
//         if (parentSlug && !hasSelectedSiblings) {
//           newSelectedCategories = newSelectedCategories.filter(
//             (slug) => slug !== parentSlug,
//           );
//         }
//       }
//     } else {
//       // CHECKING LOGIC
//       if (!parentSlug) {
//         // If checking a main category, add it and all its subcategories
//         const category = categories.find((c) => c.slug === categorySlug);
//         const subCategorySlugs =
//           category?.subcategories.map((sub) => sub.slug) || [];
//         newSelectedCategories = [
//           ...selectedCategories,
//           categorySlug,
//           ...subCategorySlugs,
//         ];
//       } else {
//         // If checking a subcategory, add it and its parent
//         newSelectedCategories = [...selectedCategories, categorySlug];
//         if (parentSlug && !selectedCategories.includes(parentSlug)) {
//           newSelectedCategories.push(parentSlug);
//         }
//       }
//     }

//     // Use a Set to remove duplicates and create the final, definitive list
//     const finalSelected = [...new Set(newSelectedCategories)];
//     setSelectedCategories(finalSelected);

//     const newFilterValue = finalSelected.join(",");
//     let newUrl = "";

//     if (newFilterValue) {
//       // If there are any selected categories, update the 'filter' param
//       newUrl = formUrlQuery({
//         params: searchParams.toString(),
//         key: "filter",
//         value: newFilterValue,
//       });
//     } else {
//       // If no categories are selected, remove the 'filter' param from the URL
//       newUrl = removeKeysFromUrl({
//         params: searchParams.toString(),
//         keysToRemove: ["filter"],
//       });
//     }

//     router.push(newUrl, { scroll: false });
//   };

//   useEffect(() => {
//     const getCategories = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("/api/categories");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getCategories();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Skeleton className="w-full" height={600} />
//       ) : (
//         <Accordion type="single" collapsible className="w-full pl-10">
//           {categories?.map((item) => (
//             <AccordionItem key={item._id} value={item._id}>
//               <AccordionTrigger className="!py-2 cursor-pointer">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id={item._id}
//                     checked={selectedCategories.includes(item.slug)}
//                     onCheckedChange={() => handleCategoryClick(item.slug)}
//                     className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-0 cursor-pointer"
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <Label
//                     htmlFor={item._id}
//                     className="text-xl font-medium cursor-pointer hover:text-primary-500"
//                   >
//                     {item.title}
//                   </Label>
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent>
//                 <div className="flex flex-col gap-4 ms-10">
//                   {item.subcategories?.map((itemSub) => (
//                     <div
//                       key={itemSub._id}
//                       className="flex items-center space-x-2 mt-2"
//                     >
//                       <Checkbox
//                         id={itemSub._id}
//                         checked={selectedCategories.includes(itemSub.slug)}
//                         onCheckedChange={() =>
//                           handleCategoryClick(itemSub.slug, item.slug)
//                         }
//                         className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-0 cursor-pointer"
//                       />
//                       <Label
//                         htmlFor={itemSub._id}
//                         className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary-500"
//                       >
//                         {itemSub.name}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       )}
//     </>
//   );
// };

// export default ProductsCatAccordion;

"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Skeleton } from "@mui/material";

// These types can be moved to a shared types file
interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  title: string;
  slug: string;
  subcategories: SubCategory[];
}

// 1. Define clear props for the controlled component
interface ProductsCatAccordionProps {
  /** The list of currently selected category slugs, provided by the parent. */
  selectedCategories: string[];
  /** A callback function to notify the parent of a change in selection. */
  onCategoryChange: (newCategories: string[]) => void;
}

const ProductsCatAccordion = ({
  selectedCategories,
  onCategoryChange,
}: ProductsCatAccordionProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCategoryClick = (categorySlug: string, parentSlug?: string) => {
    let newSelectedCategories: string[];

    if (selectedCategories.includes(categorySlug)) {
      // UNCHECKING LOGIC (remains the same)
      if (!parentSlug) {
        const category = categories.find((c) => c.slug === categorySlug);
        const subCategorySlugs =
          category?.subcategories.map((sub) => sub.slug) || [];
        newSelectedCategories = selectedCategories.filter(
          (slug) => slug !== categorySlug && !subCategorySlugs.includes(slug),
        );
      } else {
        newSelectedCategories = selectedCategories.filter(
          (slug) => slug !== categorySlug,
        );
        const parentCategory = categories.find((c) => c.slug === parentSlug);
        const hasSelectedSiblings = parentCategory?.subcategories.some((sub) =>
          newSelectedCategories.includes(sub.slug),
        );
        if (parentSlug && !hasSelectedSiblings) {
          newSelectedCategories = newSelectedCategories.filter(
            (slug) => slug !== parentSlug,
          );
        }
      }
    } else {
      // CHECKING LOGIC (remains the same)
      if (!parentSlug) {
        const category = categories.find((c) => c.slug === categorySlug);
        const subCategorySlugs =
          category?.subcategories.map((sub) => sub.slug) || [];
        newSelectedCategories = [
          ...selectedCategories,
          categorySlug,
          ...subCategorySlugs,
        ];
      } else {
        newSelectedCategories = [...selectedCategories, categorySlug];
        if (parentSlug && !selectedCategories.includes(parentSlug)) {
          newSelectedCategories.push(parentSlug);
        }
      }
    }

    const finalSelected = [...new Set(newSelectedCategories)];

    onCategoryChange(finalSelected);
  };

  // Data fetching remains the same. This is the component's internal responsibility.
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton className="w-full" height={600} />
      ) : (
        <Accordion type="single" collapsible className="w-full pl-10">
          {categories?.map((item) => (
            <AccordionItem key={item._id} value={item._id}>
              <AccordionTrigger className="!py-2 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={item._id}
                    // This now correctly uses the prop for its checked state
                    checked={selectedCategories.includes(item.slug)}
                    onCheckedChange={() => handleCategoryClick(item.slug)}
                    onClick={(e) => e.stopPropagation()}
                    className=""
                  />
                  <Label htmlFor={item._id} className="text-xl font-medium">
                    {item.title}
                  </Label>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 ms-10">
                  {item.subcategories?.map((itemSub) => (
                    <div
                      key={itemSub._id}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Checkbox
                        id={itemSub._id}
                        checked={selectedCategories.includes(itemSub.slug)}
                        onCheckedChange={() =>
                          handleCategoryClick(itemSub.slug, item.slug)
                        }
                      />
                      <Label
                        htmlFor={itemSub._id}
                        className="text-lg font-medium"
                      >
                        {itemSub.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default ProductsCatAccordion;
