"use client";

import {useEffect, useState} from "react";
import moment from "moment-timezone";

export default function TopPanel() {

  const [currentDate, setCurrentDate] = useState<ReturnType<typeof moment> | null>(null);

  useEffect(
      () => {
        const interval = setInterval(() => {
          setCurrentDate(moment().tz("America/Toronto"));
        }, 1000);
        return () => clearInterval(interval);
      },
      []
  );

  return (
      <header className={"panel text-xl"}>
        <span className={"font-bold mr-3"}>{currentDate ? currentDate.format("h:mm A") : ""}</span>
        <span>{currentDate ? currentDate.format('ddd, MMM D') : ""}</span>
      </header>
  )
}