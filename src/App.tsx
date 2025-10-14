import { MainFrame } from "@/components/MainFrame"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"
import { useMemo } from "react"
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

  return <MainFrame>APP</MainFrame>
}

export default App
