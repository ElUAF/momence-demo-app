import type { VercelRequest, VercelResponse } from "@vercel/node"

const TARGET_URL =
  "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Basic CORS support for browser callers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" })
    return
  }

  try {
    const upstream = await fetch(TARGET_URL, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        "Cache-Control": "no-cache",
      },
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "")
      res
        .status(upstream.status)
        .setHeader("Content-Type", "text/plain; charset=utf-8")
        .send(
          text || `Upstream error ${upstream.status} ${upstream.statusText}`,
        )
      return
    }

    const body = await upstream.text()
    res.setHeader("Content-Type", "text/plain; charset=utf-8")
    res.status(200).send(body)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    res.status(502).json({ error: "Bad Gateway", message })
  }
}
