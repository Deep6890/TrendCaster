import { useEffect, useState } from "react"
import Navbar from "../src/components/sections/Navbar"
import ChartsBase from "./components/cards/ChartsBase"
import MarketTermsSection from "./components/sections/MarketTermsSection"
import SectorsPerformenceHub from "./components/sections/SectorsPerformenceHub"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vgfgahiplrdblbwhapsv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZmdhaGlwbHJkYmxid2hhcHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjA0NDIsImV4cCI6MjA4NDQ5NjQ0Mn0.s3jxDmOxtxnT3RI6fTJNWrLhONCr-WlYf5peoZjjSls"

export const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("test_table")
        .select("*")

      if (error) {
        console.error(error)
        setError(error)
      } else {
        console.log(data)
        setData(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex w-full flex-col min-h-auto bg-white justify-center items-center">
      <Navbar />
      <MarketTermsSection />
      <SectorsPerformenceHub />
      <ChartsBase header="Bar chart" subheader="Hii" />
    </div>
  )
}

export default App
