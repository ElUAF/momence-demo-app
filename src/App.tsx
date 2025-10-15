import { MainFrame } from "@/components/MainFrame"
import { Input } from "@/components/Input"
import { CurrencySelect } from "@/components/CurrencySelect"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
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

const decimalCount = 4

function keepMaxDecimals(value: string) {
  const match = value.match(/^(-?\d+)([,.]\d{1,4})?/)
  if (match) {
    return match[1] + (match[2] || "")
  }
  return value
}

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

  const [currency, setCurrency] = useState("EUR")
  const currencyRate = useMemo(
    () => dailyRates?.rates?.find((it) => it.code === currency),
    [dailyRates, currency],
  )

  const [czkRawValue, setRawCzkValue] = useState("100")
  const [foreignRawValue, setForeignRawValue] = useState("100")

  useEffect(() => {
    if (currencyRate) {
      setForeignRawValue(
        `${((parseFloat(czkRawValue) * currencyRate.amount) / currencyRate.rate).toFixed(decimalCount)}`,
      )
    }
  }, [currencyRate]) // there is only currencyRate - we don't need to recalculate it on every change of czkRawValue

  const handleCzkChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = keepMaxDecimals(e.target.value)
      setRawCzkValue(newValue)
      if (currencyRate) {
        setForeignRawValue(
          `${((parseFloat(newValue) * currencyRate.amount) / currencyRate.rate).toFixed(decimalCount)}`,
        )
      }
    },
    [currencyRate],
  )

  const handleForeignChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = keepMaxDecimals(e.target.value)
      setForeignRawValue(newValue)

      if (currencyRate) {
        setRawCzkValue(
          `${((parseFloat(newValue) * currencyRate.rate) / currencyRate.amount).toFixed(decimalCount)}`,
        )
      }
    },
    [currencyRate],
  )

  const handleCurrencyChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCurrency(e.target.value)
    },
    [],
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
          min="0"
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
          min="0"
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
          Current rate: 1 CZK to{" "}
          {(currencyRate.amount / currencyRate.rate).toFixed(decimalCount)}{" "}
          {currency}
        </Row>
      )}
    </MainFrame>
  )
}

export default App
