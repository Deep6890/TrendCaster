import { useEffect, useState } from "react"
import Navbar from "../src/components/sections/Navbar"
import ChartsBase from "./components/cards/ChartsBase"
import MarketTermsSection from "./components/sections/MarketTermsSection"
import SectorsPerformenceHub from "./components/sections/SectorsPerformenceHub"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)


function App() {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("market_sector_data")
        .select("*")
        .order("captured_at", { ascending: false });

      console.log("Supabase Data:", data, "Error:", error);
    };

    fetchData();
  }, []);

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
