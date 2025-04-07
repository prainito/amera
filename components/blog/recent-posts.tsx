import Link from "next/link"
import Image from "next/image"
import { getRecentPosts } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"

export function RecentPosts() {
  const recentPosts = getRecentPosts(3)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        View all posts →
      </Link>
    </div>
  )
}

