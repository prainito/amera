import { redirect } from "next/navigation"

export default function DappHome() {
  redirect("/app/dashboard")
  return null
}

