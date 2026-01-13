import React from 'react';
import BentoGrid from "../src/components/sections/BentoForTredNews"
import Navbar from "../src/components/sections/Navbar"
import { TrendingSectors } from "../src/components/sections/TrendingSectors"
import DailyOverView from "../src/components/DailyOverView"

function App() {
  return (
    <>
      <div className="flex w-full flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center w-full flex-row p-6 gap-6">
          <div className="w-[60%]">
            <TrendingSectors />
          </div>
          <div className="w-[35%]">
            <DailyOverView />
          </div>
        </div>
      </div>
      <BentoGrid />
    </>
  )
}

export default App;
