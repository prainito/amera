"use client"

import { useState } from "react"

interface BlogCategoriesProps {
  categories: string[]
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => setActiveCategory(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeCategory === null
            ? "bg-blue-600 text-white dark:bg-blue-700"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === category
              ? "bg-blue-600 text-white dark:bg-blue-700"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

