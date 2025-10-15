import { useCallback, useEffect, useMemo, useState } from "react"
import { useNumberInput } from "@/components/Input"
import type { InputChangeEvent } from "@/components/Input/hooks.ts"
import type { HTMLSelectElementChangeEvent } from "@/components/Select"
import type { DailyRateData } from "@/types.ts"

export const decimalCount = 4

export const defaultCurrencyOptions = [
  {
    code: "CZK",
    name: "Czech Koruna",
  },
  {
    code: "EUR",
    name: "Euro",
  },
]

export const useAppLogic = (config: { dailyRates: DailyRateData | null }) => {
  const { dailyRates } = config
  const [currency, setCurrency] = useState("EUR")
  const currencyRate = useMemo(
    () => dailyRates?.rates?.find((it) => it.code === currency),
    [dailyRates, currency],
  )

  const {
    numberValue: czInputNumber,
    onChange: czInputOnChange,
    setNumberValue: czInputValueSetNumberValue,
    ...czInputValue
  } = useNumberInput({
    initialValue: 100,
    maxDecimals: decimalCount,
  })

  const {
    setNumberValue: foreignInputSetNumberValue,
    onChange: foreignInputValueOnChange,
    ...foreignInputValue
  } = useNumberInput({
    initialValue: 100,
    maxDecimals: decimalCount,
  })

  useEffect(() => {
    if (currencyRate) {
      foreignInputSetNumberValue(
        (czInputNumber * currencyRate.amount) / currencyRate.rate,
      )
    }
  }, [currencyRate, foreignInputSetNumberValue]) // there is only currencyRate - we don't need to recalculate it if only cz value is changed

  const handleCzkChange = useCallback(
    (e: InputChangeEvent) => {
      const { newNumberValue } = czInputOnChange(e)
      if (currencyRate) {
        foreignInputSetNumberValue(
          (newNumberValue * currencyRate.amount) / currencyRate.rate,
        )
      }
    },
    [currencyRate, czInputOnChange, foreignInputSetNumberValue],
  )

  const handleForeignChange = useCallback(
    (e: InputChangeEvent) => {
      const { newNumberValue } = foreignInputValueOnChange(e)
      if (currencyRate) {
        czInputValueSetNumberValue(
          (newNumberValue * currencyRate.rate) / currencyRate.amount,
        )
      }
    },
    [currencyRate, foreignInputValueOnChange, czInputValueSetNumberValue],
  )

  const handleCurrencyChange = useCallback(
    (e: HTMLSelectElementChangeEvent) => {
      setCurrency(e.target.value)
    },
    [],
  )

  const currencyOptions = useMemo(() => {
    return (
      dailyRates?.rates
        ?.map((it) => ({
          code: it.code,
          name: it.currency,
        }))
        .sort((a, b) => a.code.localeCompare(b.code)) ?? defaultCurrencyOptions
    )
  }, [dailyRates])

  return {
    setCurrency,
    handleCurrencyChange,
    currencyOptions,
    currency,
    currencyRate,
    czInputValueProps: {
      ...czInputValue.props,
      onChange: handleCzkChange,
    },
    foreignInputValueProps: {
      ...foreignInputValue.props,
      onChange: handleForeignChange,
    },
  }
}
