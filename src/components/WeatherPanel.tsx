"use client";
import styles from "./WeatherPanel.module.css";

import {useEffect, useState} from "react";
import {Weather} from "@/models/weather";
import {getWeather} from "@/actions/getWeather";

const bullet = <>&nbsp;&nbsp;•&nbsp;&nbsp;</>;

export default function () {

  const [currentWeather, setCurrentForecast] = useState<Weather | null>(null);

  useEffect(
      () => {
        getWeather().then(setCurrentForecast);
        const interval = setInterval(() => {
          getWeather().then(setCurrentForecast);
        }, 1000 * 60);
        return () => clearInterval(interval);
      },
      []
  );

  if (!currentWeather) {
    return (
        <div className={"panel flex-grow flex flex-col justify-center items-center gap-y-3"}>
          <span className={"text-xl"}>Loading Weather...</span>
        </div>
    )
  }

  const temperature = Math.round(currentWeather.main.temp - 273.15);
  const minTemperature = Math.round(currentWeather.main.temp_min - 273.15);
  const maxTemperature = Math.round(currentWeather.main.temp_max - 273.15);
  const feelsTemperature = Math.round(currentWeather.main.feels_like - 273.15);

  const icon = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`;

  return (
      <div className={"panel flex-col flex-grow flex justify-center items-center gap-y-2"}>
        <div className={"flex justify-center items-center gap-x-4"}>
          <img alt={""} className={styles.weatherIcon} key={icon} src={icon}/>
          <span className={"text-4xl"}>{temperature}°C</span>
        </div>
        <span className={"text-gray-69"}>Max {maxTemperature}°C{bullet}Min {minTemperature} °C{bullet}Feels {feelsTemperature} °C</span>
      </div>
  )
}