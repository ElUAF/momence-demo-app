import { MainFrame } from "@/components/MainFrame"
import { Input } from "@/components/Input"
import { CurrencySelect } from "@/components/CurrencySelect"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"
import { useCallback, useMemo } from "react"
import { centralBankDataParser } from "@/centralBankDataParser"
import { Row } from "@/components/Row/Row.tsx"
import { Loading } from "@/components/Loading"
import { Button } from "@/components/Button"
import { CurrencyRatesTable } from "@/components/CurrencyRatesTable"
import {
  decimalCount,
  defaultCurrencyOptions,
  useAppLogic,
} from "@/App.hooks.ts"

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

  const {
    setCurrency,
    czInputValueProps,
    foreignInputValueProps,
    currencyRate,
    currency,
    handleCurrencyChange,
    currencyOptions,
  } = useAppLogic({
    dailyRates,
  })

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
          {...czInputValueProps}
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
          {...foreignInputValueProps}
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
