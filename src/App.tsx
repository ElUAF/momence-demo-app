import { Layout } from "@/components/Layout"
import { useQuery } from "@tanstack/react-query"
import { fetchDailyRates } from "@/api"

function App() {
  const {
    data: dailyRates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dailyRates"], // Unique key for caching and refetching
    queryFn: fetchDailyRates, // The function that fetches the data
  })

  console.info({ dailyRates, isLoading, error })

  return <Layout>APP</Layout>
}

export default App
