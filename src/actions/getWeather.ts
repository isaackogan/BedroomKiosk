"use server";
import {Weather} from "@/models/weather";

export async function getWeather(): Promise<Weather> {

  const response = await fetch(
      (
          `https://api.openweathermap.org/data/2.5/weather` +
          `?lat=${process.env.HOME_LAT}&lon=${process.env.HOME_LON}` +
          `&appid=${process.env.WEATHER_API_KEY}`
      )
  );

  return await response.json();

}