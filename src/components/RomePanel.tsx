"use client";
import styles from "./RomePanel.module.css";
import {Plane} from "lucide-react";

import {useEffect, useState} from "react";
import moment from "moment-timezone";

function DayCount({num}: { num: string }) {
  if (num.length > 1) {
    num = num.slice(1);
  }

  return (
      <span className={"rounded-lg py-4 px-2 text-5xl " + styles.dayCount}>
        {num}
      </span>
  )
}

export default function RomePanel() {

  const [daysLeft, setDaysLeft] = useState<number>(0);
  const romeDate = 1752811209;

  useEffect(
      () => {
        const interval = setInterval(() => {
          const currentDate = moment().tz("America/Toronto");
          const daysUntilRome = Math.floor((romeDate - (currentDate?.unix() || 0)) / 86400);
          setDaysLeft(daysUntilRome);
        }, 1000);
        return () => clearInterval(interval);
      },
      []
  );



  return (
      <div className={"panel flex-grow flex flex-col justify-center items-center gap-y-3"} style={{fontFamily: "Cantata One"}}>
        <div className={"flex justify-center gap-4"}>
          {daysLeft.toString().split("").map((num, index) => <DayCount key={index} {...{num}}/>)}
        </div>
        <span className={styles.dayCountText}>Days Until Rome</span>
      </div>
  );
}