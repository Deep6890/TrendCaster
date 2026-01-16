import React from 'react';
import BentoGrid from "../src/components/sections/BentoForTredNews"
import Navbar from "../src/components/sections/Navbar"
import { TrendingSectors } from "../src/components/sections/TrendingSectors"
import DailyOverView from "./components/DailyOverView"
import ChartCard from './components/charts/ChartCard';
import { useEffect, useState } from 'react';

function App() {

  const [dataset, setDataset] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(res => res.json())
      .then(raw => {
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

        const formatted = data.map((row, i) => ({
          index: i + 1,
          close: row.Close,
        }));

        setDataset(formatted);
      });
  }, []);
  return (
    <>
      <div className="flex w-full flex-col min-h-auto bg-white justify-center items-center">
        <Navbar />
        <div className="flex items-center justify-center w-full flex-row p-6 gap-6">
          <div className="w-[60%]">
            <TrendingSectors />
          </div>
          <div className="w-[35%]">
            <DailyOverView />
          </div>
        </div>
        <ChartCard dataset={dataset} />
      </div>
      {/* <div className='flex flex-rows justify-between'><div className='flex flex-col w-[70%]]'><BentoGrid /></div></div> */}
    </>
  )
}

export default App;
