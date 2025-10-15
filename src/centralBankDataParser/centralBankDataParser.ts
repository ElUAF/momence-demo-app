import type { DailyRateData } from "@/types.ts"

export interface CurrencyRate {
  /** The country name associated with the currency. */
  country: string

  /** The full name of the currency (e.g., "dollar", "euro"). */
  currency: string

  /** The amount of the foreign currency used for the rate calculation (e.g., 1, 100, 1000). */
  amount: number

  /** The 3-letter ISO code for the currency (e.g., "AUD", "EUR", "USD"). */
  code: string

  /** The actual exchange rate value (the local currency equivalent of the 'amount' foreign currency). */
  rate: number
}

function formatLocalDateIsoFormat(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const year = d.getFullYear()

  return `${year}-${month}-${day}`
}

export const centralBankDataParser = (rawData: string): DailyRateData => {
  const rows = rawData.split("\n").filter((it) => it)

  if (rows.length < 2) {
    throw new Error("Invalid data format")
  }

  const datePart = rows[0].split(" ").slice(0, 3).join(" ")
  const dateObject = new Date(datePart)

  const header: Record<string, number> = rows[1]
    .split("|")
    .map((it) => it.trim().toLowerCase())
    .reduce(
      (acc, it, index) => {
        acc[it] = index
        return acc
      },
      {} as Record<string, number>,
    )

  return {
    date: formatLocalDateIsoFormat(dateObject),
    rates: rows.splice(2, rows.length - 2).map((row) => {
      const rowData = row.split("|").map((it) => it.trim())

      const amountRaw = rowData[header["amount"]]
      if (!amountRaw.matchAll(/[0-9]+/g)) {
        throw new Error(`Row ${row} contains invalid amount: ${amountRaw}`)
      }

      const rateRaw = rowData[header["rate"]]
      if (!rateRaw.matchAll(/[0-9]+([.][0-9]+)?/g)) {
        throw new Error(`Row ${row} contains invalid rate: ${rateRaw}`)
      }

      return {
        country: rowData[header["country"]],
        currency: rowData[header["currency"]],
        amount: parseInt(amountRaw),
        code: rowData[header["code"]],
        rate: parseFloat(rateRaw),
      }
    }),
  }
}
