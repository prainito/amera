export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  author: {
    name: string
    avatar: string
  }
  category: string
  readTime: number
  featured?: boolean
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-amera-digital-usd-works",
    title: "How Amera Digital USD Works: A Comprehensive Guide",
    excerpt:
      "Learn how Amera Digital USD provides a secure, high-yield alternative to traditional banking with complete control over your assets.",
    publishedAt: "2023-03-08",
    author: {
      name: "Amera Team",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Platform Guide",
    readTime: 6,
    featured: true,
    image: "/placeholder.svg?height=600&width=1200",
    content: `
# How Amera Digital USD Works: A Comprehensive Guide

## Introduction

In today's financial landscape, traditional banking often falls short. Low interest rates, hidden fees, and lack of control over your assets can leave you feeling frustrated. Amera Digital USD offers a revolutionary alternative that combines the stability of USD with the benefits of digital assets.

## What is Digital USD?

Digital USD is a fully-backed digital representation of the US Dollar. Unlike cryptocurrencies that can fluctuate wildly in value, Digital USD maintains a stable 1:1 peg to the US Dollar. This means $1 of Digital USD is always worth $1 USD, providing the stability you need with the benefits of digital assets.

## The Amera Advantage

### 1. High Yield Returns (Up to 8%)

Traditional banks offer minimal interest rates, often below 0.5%. Amera provides up to 8% annual interest on your Digital USD holdings. This means your money works harder for you without the volatility associated with cryptocurrencies or stock markets.

### 2. No Hidden Fees

We believe in transparency. Amera has eliminated the complex fee structures common in traditional banking:
- No monthly maintenance fees
- No minimum balance requirements
- No transaction fees
- No withdrawal fees

### 3. Complete Control

With Amera, you maintain full control over your assets. You can:
- Deposit and withdraw funds at any time
- Track your interest earnings in real-time
- Manage your account from anywhere in the world
- Transfer Digital USD instantly to other users

## How to Get Started

### Step 1: Sign Up

Creating your Amera account takes just minutes. All you need is an email address and password to get started. Our streamlined verification process ensures your account is secure while minimizing hassle.

### Step 2: Deposit Funds

Converting your traditional currency to Digital USD is simple. You can add funds via:
- Credit or debit card
- Bank transfer
- Apple Pay
- Other supported payment methods

Once your deposit is processed, your Digital USD becomes available in your account and immediately starts earning interest.

### Step 3: Watch Your Money Grow

Your Digital USD automatically earns interest daily, with returns compounded to maximize your earnings. The intuitive dashboard shows you exactly how much you're earning and projects your future returns.

## Security Measures

Security is our top priority. Amera implements multiple layers of protection:

- Bank-grade encryption for all transactions
- Multi-factor authentication
- Regular security audits
- Cold storage for digital assets
- Regulatory compliance

## The Technology Behind Amera

Amera combines traditional financial infrastructure with modern blockchain technology to create a secure, efficient system:

1. **Asset Backing**: Every Digital USD is backed 1:1 by actual USD held in reserve
2. **Smart Contracts**: Automated processes ensure transparent interest payments and transactions
3. **Distributed Ledger**: Provides immutable records of all transactions
4. **API Integration**: Connects seamlessly with traditional banking systems

## Frequently Asked Questions

### Is my money safe with Amera?
Yes. All Digital USD is fully backed by USD reserves, and we implement bank-grade security measures to protect your assets.

### How does Amera offer such high interest rates?
We eliminate the overhead costs of traditional banks and optimize yield generation through strategic lending and investment in secure, regulated markets.

### Can I withdraw my money at any time?
Absolutely. Unlike traditional CDs or fixed deposits, your Digital USD remains liquid and available for withdrawal at any time with no penalties.

### Is Amera regulated?
Yes, Amera operates in compliance with all relevant financial regulations to ensure the safety and security of your assets.

## Conclusion

Amera Digital USD represents the future of personal finance—combining the stability of USD with higher returns, greater control, and enhanced security. By eliminating unnecessary fees and inefficiencies, we're able to offer you a superior alternative to traditional banking.

Ready to experience the Amera advantage? [Sign up today](#) and start earning the returns your money deserves.
    `,
  },
]

export function getBlogPosts() {
  return blogPosts
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function getFeaturedPosts() {
  return blogPosts.filter((post) => post.featured)
}

export function getRecentPosts(count = 3) {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count)
}

export function getCategories() {
  const categories = new Set<string>()
  blogPosts.forEach((post) => categories.add(post.category))
  return Array.from(categories)
}

