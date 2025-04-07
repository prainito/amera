// Define all application routes in a central location
export const routes = {
  // Public routes
  home: "/",
  login: "/login",
  signup: "/signup",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,

  // App routes
  dashboard: "/app/dashboard",
  trade: "/app/trade",
  send: "/app/send",
  earn: "/app/earn",
  earnDetails: (id: string) => `/app/earn/${id}`,
  depositWithdraw: "/app/deposit-withdraw",
  transactions: "/app/transactions",
  rewards: "/app/rewards",
  account: "/app/account",
  settings: "/app/settings",
}

// Navigation items for the main sidebar
export const mainNavigation = [
  { name: "Dashboard", href: routes.dashboard, icon: "Home" },
  { name: "Trade", href: routes.trade, icon: "BarChart3" },
  { name: "Send & Receive", href: routes.send, icon: "Send" },
  { name: "Earn", href: routes.earn, icon: "Wallet" },
  { name: "Deposit & Withdraw", href: routes.depositWithdraw, icon: "CreditCard" },
  { name: "Transactions", href: routes.transactions, icon: "History" },
  { name: "Rewards", href: routes.rewards, icon: "Gift" },
  { name: "Account", href: routes.account, icon: "Settings" },
]

