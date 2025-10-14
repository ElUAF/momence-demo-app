export async function fetchDailyRates() {
  const response = await fetch("/api/central-bank-proxy")

  if (!response.ok) {
    throw new Error("Fetching daily rates failed, network response was not ok")
  }

  return response.text()
}
