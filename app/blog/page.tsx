import type { Metadata } from "next"
import { getBlogPosts, getCategories, getFeaturedPosts } from "@/lib/blog-data"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogCategories } from "@/components/blog/blog-categories"
import { RecentPosts } from "@/components/blog/recent-posts"

export const metadata: Metadata = {
  title: "Blog | Amera Digital USD",
  description: "Explore the latest insights, guides, and updates about Amera Digital USD and the future of finance.",
}

export default function BlogPage() {
  const posts = getBlogPosts()
  const featuredPosts = getFeaturedPosts()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Amera Blog</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Insights, guides, and updates about Digital USD and the future of finance
        </p>
      </div>

      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Featured Posts</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} featured />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3">
          <BlogCategories categories={categories} />

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="sticky top-24 space-y-8">
            <RecentPosts />
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Subscribe to Our Newsletter</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Stay updated with the latest news and insights about Digital USD.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

