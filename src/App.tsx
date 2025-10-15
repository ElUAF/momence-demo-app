import { MainFrame } from "@/components/MainFrame"
import { Input, useNumberInput } from "@/components/Input"
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
import { Loading } from "@/components/Loading"
import { Button } from "@/components/Button"
import { CurrencyRatesTable } from "@/components/CurrencyRatesTable"

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

function App() {
  const {
    data: dailyRatesRaw,
    isLoading,
    error: apiError,
    refetch,
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
    (e: ChangeEvent<HTMLInputElement>) => {
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
    (e: ChangeEvent<HTMLInputElement>) => {
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
    (e: ChangeEvent<HTMLSelectElement>) => {
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

  const errorMessage = useMemo(() => {
    if (apiError) {
      return `Failed to load rates from the central bank`
    }
    if (error) {
      return error
    }
    return null
  }, [apiError, error])

  const handleTryAgain = useCallback(async () => {
    await refetch()
  }, [refetch])

  if (isLoading && !dailyRates) {
    return (
      <MainFrame>
        <Loading text="Loading rates from the central bank…" />
      </MainFrame>
    )
  }

  if (!isLoading && errorMessage) {
    return (
      <MainFrame>
        <Row>{errorMessage}</Row>
        <Row>
          <Button $variant="primary" onClick={handleTryAgain}>
            Retry
          </Button>
        </Row>
      </MainFrame>
    )
  }

  return (
    <MainFrame>
      <Row>
        <Input
          type="number"
          {...czInputValue.props}
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
          {...foreignInputValue.props}
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
      {dailyRates?.rates && dailyRates.rates.length > 0 && (
        <Row>
          <CurrencyRatesTable
            rates={dailyRates.rates}
            caption={
              dailyRates.date
                ? `Official rates for ${dailyRates.date}`
                : undefined
            }
            selectedCode={currency}
            onSelectCode={setCurrency}
          />
        </Row>
      )}
    </MainFrame>
  )
}

export default App
