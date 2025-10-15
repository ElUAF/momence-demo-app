import type { CurrencyRate } from "@/centralBankDataParser/centralBankDataParser.ts"

export interface DailyRateData {
  /** The effective date of the exchange rates (e.g., "13 Oct 2025"). */
  date: string

  /** An array of all individual currency rate entries. */
  rates: CurrencyRate[]
}
