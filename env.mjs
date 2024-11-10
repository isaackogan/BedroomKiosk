import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
  server: {
    WEATHER_API_KEY: z.string(),
    HOME_LAT: z.number(),
    HOME_LON: z.number(),

    NEXT_PUBLIC_AUTH_URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_AUTH_URL: z.string(),
  },
  runtimeEnv: {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    HOME_LAT: parseFloat(process.env.HOME_LAT),
    HOME_LON: parseFloat(process.env.HOME_LON),

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },
});