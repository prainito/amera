import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/blog-data"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${featured ? "col-span-2 md:col-span-2" : ""}`}
    >
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              {post.readTime} min read
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          <p className="mb-3 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
          <div className="flex items-center">
            <Image
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{post.author.name}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

