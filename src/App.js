import * as React from 'react';
// import ReactDOM from 'react-dom';

import './App.css';
// import UilReact from '@iconscout/react-unicons/icons/uil-react';
import TopButtons from './components/TopButtons.jsx';
import Inputs from './components/Inputs.jsx';
import TimeAndLocation from './components/TimeAndLocation.jsx';
import TemperatureAndDetails from './components/TemperatureAndDetails.jsx';
import Forecast from './components/Forecast.jsx';
import getFormattedWeatherData from './services/weatherService';
import { useEffect, useState } from 'react';

function App() {

  const [query, setQuery] = useState({q: 'Ongole'}) //default city is Ongole
  const [units, setUnits] = useState("metric" ) //default units are metric (Celsius and Km/h)
  const [weather, setWeather] = useState(null) //default weather is null

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({...query, units}).then((data) => {
        setWeather(data);
      });
    };
    fetchWeather();
  }, [query, units]);

  return (
    <div className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400">
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          <TimeAndLocation weather = {weather} />
          <TemperatureAndDetails weather = {weather} />

          {/* <Forecast title="hourly forecast" items={weather.hourly} /> */}
          <Forecast title="daily forecast" items={weather.daily} />
        </div>
      )}
    </div>
  );
}

export default App;
