import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle } from "lucide-react"

export function weatherIconFor(condition = "") {
  const c = condition.toLowerCase()
  if (c.includes("rain")) return CloudRain
  if (c.includes("drizzle")) return CloudDrizzle
  if (c.includes("partly") || c.includes("cloud")) return c.includes("partly") ? CloudSun : Cloud
  return Sun
}
