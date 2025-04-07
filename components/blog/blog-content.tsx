"use client"

import { useEffect, useRef } from "react"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Convert markdown-like content to HTML
      let html = content
        // Headers
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Lists
        .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
        .replace(/^\d\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
        // Links
        .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-600 hover:underline dark:text-blue-400">$1</a>')
        // Paragraphs
        .replace(/^(?!<[hl]|<li|<\/).+/gm, (match) => {
          return match.trim() ? `<p class="mb-4 text-gray-700 dark:text-gray-300">${match}</p>` : ""
        })

      // Wrap lists
      html = html
        .replace(/<li class="ml-6 list-disc">/g, (match, index, original) => {
          if (index === 0 || original.substring(index - 5, index) !== 'disc">') {
            return '<ul class="mb-4 space-y-2">' + match
          }
          return match
        })
        .replace(/<li class="ml-6 list-decimal">/g, (match, index, original) => {
          if (index === 0 || original.substring(index - 8, index) !== 'decimal">') {
            return '<ol class="mb-4 space-y-2">' + match
          }
          return match
        })

      // Close lists
      html = html.replace(/<\/li>\n(?!<li)/g, "</li></ul>\n").replace(/<\/li>\n(?!<li)/g, "</li></ol>\n")

      contentRef.current.innerHTML = html
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose prose-blue max-w-none dark:prose-invert prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:text-gray-700 prose-p:dark:text-gray-300"
    />
  )
}

