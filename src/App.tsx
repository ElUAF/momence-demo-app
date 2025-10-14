import { MainFrame } from "@/components/MainFrame"
import { Input } from "@/components/Input"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"
import { type ChangeEvent, useCallback, useMemo, useState } from "react"
import { centralBankDataParser } from "@/centralBankDataParser"

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

  const currency = "EUR"

  const currencyRate = useMemo(
    () => dailyRates?.rates?.find((it) => it.code === currency),
    [dailyRates, currency],
  )

  return (
    <MainFrame>
      <div>
        Current {currency} rate is {currencyRate ? currencyRate.rate : "N/A"}
      </div>
      <div>
        <Input
          type="number"
          value={czkRawValue}
          onChange={handleCzkChange}
          $fullWidth
          $size="lg"
          disabled={!currencyRate}
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="EUR"
          value={foreignRawValue}
          onChange={handleForeignChange}
          $fullWidth
          $size="lg"
          disabled={!currencyRate}
        />
      </div>
    </MainFrame>
  )
}

export default App
