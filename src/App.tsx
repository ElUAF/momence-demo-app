import { MainFrame } from "@/components/MainFrame"
import { Input } from "@/components/Input"
import { CurrencySelect } from "@/components/CurrencySelect"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"
import { type ChangeEvent, useCallback, useMemo, useState } from "react"
import { centralBankDataParser } from "@/centralBankDataParser"
import { Row } from "@/components/Row/Row.tsx"

const defaultCurrencyOptions = [
  {
    code: "CZK",
    name: "Czech Koruna",
  },
  {
    code: "EUR",
    name: "Euro",
  },
]

function App() {
  const {
    data: dailyRatesRaw,
    isLoading,
    error: apiError,
  } = useQuery({
    queryKey: ["dailyRates"], // Unique key for caching and refetching
    queryFn: fetchDailyRates, // The function that fetches the data
  })

  const { dailyRates, error } = useMemo(() => {
    if (dailyRatesRaw === undefined)
      return {
        dailyRates: null,
      }

    try {
      const dailyRates = centralBankDataParser(dailyRatesRaw)
      return { dailyRates }
    } catch (ex) {
      console.error(`parsing data from central bank failed`, ex)
      return {
        dailyRates: null,
        error: "Getting data from central bank failed.",
      }
    }
  }, [dailyRatesRaw])

  console.info({ dailyRatesRaw, dailyRates, isLoading, apiError, error })
  const [czkRawValue, setRawCzkValue] = useState("1")
  const handleCzkChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRawCzkValue(e.target.value)
  }, [])

  const [foreignRawValue, setForeignRawValue] = useState("1")
  const handleForeignChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForeignRawValue(e.target.value)
    },
    [],
  )

  const [currency, setCurrency] = useState("EUR")
  const handleCurrencyChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCurrency(e.target.value)
    },
    [],
  )

  const currencyRate = useMemo(
    () => dailyRates?.rates?.find((it) => it.code === currency),
    [dailyRates, currency],
  )

  const currencyOptions = useMemo(() => {
    return (
      dailyRates?.rates?.map((it) => ({
        code: it.code,
        name: it.currency,
      })) ?? defaultCurrencyOptions
    )
  }, [dailyRates])

  return (
    <MainFrame>
      <Row>
        <Input
          type="number"
          value={czkRawValue}
          onChange={handleCzkChange}
          $fullWidth
          $size="md"
          disabled={!currencyRate}
        />
        <CurrencySelect
          value="CZK"
          onChange={handleCurrencyChange}
          options={defaultCurrencyOptions}
          $minWidth={65}
          $size="lg"
          disabled
        />
      </Row>
      <Row>
        <Input
          type="number"
          placeholder={currency}
          value={foreignRawValue}
          onChange={handleForeignChange}
          $fullWidth
          $size="md"
          disabled={!currencyRate}
        />
        <CurrencySelect
          value={currency}
          onChange={handleCurrencyChange}
          options={currencyOptions}
          $size="lg"
          $minWidth={65}
          disabled={!dailyRates}
        />
      </Row>
      {currencyRate && (
        <Row>
          Current {currency} rate is {currencyRate.rate}
        </Row>
      )}
    </MainFrame>
  )
}

export default App
