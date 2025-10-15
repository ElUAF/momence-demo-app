import { renderHook, act } from "@testing-library/react"
import { useAppLogic, decimalCount } from "@/App.hooks"
import type { DailyRateData } from "@/types.ts"

const sampleDailyRates: DailyRateData = {
  date: "2025-10-14",
  rates: [
    {
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 13.574,
    },
    {
      country: "Bulgaria",
      currency: "lev",
      amount: 1,
      code: "BGN",
      rate: 12.432,
    },
    {
      country: "Brazil",
      currency: "real",
      amount: 1,
      code: "BRL",
      rate: 3.822,
    },
    {
      country: "Canada",
      currency: "dollar",
      amount: 1,
      code: "CAD",
      rate: 14.959,
    },
    {
      country: "Switzerland",
      currency: "franc",
      amount: 1,
      code: "CHF",
      rate: 26.158,
    },
    {
      country: "China",
      currency: "renminbi",
      amount: 1,
      code: "CNY",
      rate: 2.947,
    },
    {
      country: "Denmark",
      currency: "krone",
      amount: 1,
      code: "DKK",
      rate: 3.256,
    },
    { country: "EMU", currency: "euro", amount: 1, code: "EUR", rate: 24.32 },
    {
      country: "United Kingdom",
      currency: "pound",
      amount: 1,
      code: "GBP",
      rate: 27.912,
    },
    {
      country: "Hongkong",
      currency: "dollar",
      amount: 1,
      code: "HKD",
      rate: 2.706,
    },
    {
      country: "Hungary",
      currency: "forint",
      amount: 100,
      code: "HUF",
      rate: 6.19,
    },
    {
      country: "Indonesia",
      currency: "rupiah",
      amount: 1000,
      code: "IDR",
      rate: 1.269,
    },
    {
      country: "Israel",
      currency: "new shekel",
      amount: 1,
      code: "ILS",
      rate: 6.328,
    },
    {
      country: "India",
      currency: "rupee",
      amount: 100,
      code: "INR",
      rate: 23.696,
    },
    {
      country: "Iceland",
      currency: "krona",
      amount: 100,
      code: "ISK",
      rate: 17.199,
    },
    {
      country: "Japan",
      currency: "yen",
      amount: 100,
      code: "JPY",
      rate: 13.836,
    },
    {
      country: "South Korea",
      currency: "won",
      amount: 100,
      code: "KRW",
      rate: 1.467,
    },
    {
      country: "Mexico",
      currency: "peso",
      amount: 1,
      code: "MXN",
      rate: 1.131,
    },
    {
      country: "Malaysia",
      currency: "ringgit",
      amount: 1,
      code: "MYR",
      rate: 4.974,
    },
    {
      country: "Norway",
      currency: "krone",
      amount: 1,
      code: "NOK",
      rate: 2.065,
    },
    {
      country: "New Zealand",
      currency: "dollar",
      amount: 1,
      code: "NZD",
      rate: 11.972,
    },
    {
      country: "Philippines",
      currency: "peso",
      amount: 100,
      code: "PHP",
      rate: 36.122,
    },
    {
      country: "Poland",
      currency: "zloty",
      amount: 1,
      code: "PLN",
      rate: 5.706,
    },
    {
      country: "Romania",
      currency: "leu",
      amount: 1,
      code: "RON",
      rate: 4.778,
    },
    {
      country: "Sweden",
      currency: "krona",
      amount: 1,
      code: "SEK",
      rate: 2.203,
    },
    {
      country: "Singapore",
      currency: "dollar",
      amount: 1,
      code: "SGD",
      rate: 16.167,
    },
    {
      country: "Thailand",
      currency: "baht",
      amount: 100,
      code: "THB",
      rate: 64.143,
    },
    {
      country: "Turkey",
      currency: "lira",
      amount: 100,
      code: "TRY",
      rate: 50.299,
    },
    {
      country: "USA",
      currency: "dollar",
      amount: 1,
      code: "USD",
      rate: 21.039,
    },
    { country: "IMF", currency: "SDR", amount: 1, code: "XDR", rate: 28.62 },
    {
      country: "South Africa",
      currency: "rand",
      amount: 1,
      code: "ZAR",
      rate: 1.205,
    },
  ],
}

function asNumber(val: string) {
  return Number(val)
}

describe("useAppLogic hook", () => {
  test("defaults to EUR and computes foreign value from 100 CZK", async () => {
    const { result } = renderHook(() =>
      useAppLogic({ dailyRates: sampleDailyRates }),
    )

    // Defaults
    expect(result.current.currency).toBe("EUR")
    expect(result.current.currencyRate?.code).toBe("EUR")

    // Wait for initial effect that derives foreign input from CZK value
    await act(async () => {})

    const foreignStr = result.current.foreignInputValueProps.value
    expect(asNumber(foreignStr)).toBeCloseTo(100 / 24.32, decimalCount)
    // And formatted to max decimals
    expect(foreignStr).toBe("4.1118")
  })

  test("changing CZK updates foreign value accordingly", async () => {
    const { result } = renderHook(() =>
      useAppLogic({ dailyRates: sampleDailyRates }),
    )

    await act(async () => {})

    // Simulate typing 200 CZK
    await act(async () => {
      result.current.czInputValueProps.onChange({ target: { value: "200" } })
    })

    const foreignStr = result.current.foreignInputValueProps.value
    expect(foreignStr).toBe("8.2237") // 200 / 24.32 rounded to 4 decimals
  })

  test("changing currency to USD recalculates values from current CZK", async () => {
    const { result } = renderHook(() =>
      useAppLogic({ dailyRates: sampleDailyRates }),
    )

    await act(async () => {})

    await act(async () => {
      result.current.handleCurrencyChange({ target: { value: "USD" } })
    })

    // After currency change, effect should recompute foreign from CZK=100
    const foreignStr = result.current.foreignInputValueProps.value
    expect(foreignStr).toBe("4.7531") // 100 / 21.039 rounded to 4 decimals

    // Selected code is reflected in table highlighting elsewhere; check here
    expect(result.current.currency).toBe("USD")
    expect(result.current.currencyRate?.code).toBe("USD")
  })
})
