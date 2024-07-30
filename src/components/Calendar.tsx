"use client";

import {
  FantasyCalendar,
  FantasyCalendarDate,
  decrementDay,
  distanceInMinutes,
  getMonthName,
  getMoonCycleProgressForMoon,
  getSunriseAndSunsetForDate,
  getWeekdayName,
  incrementDay,
  isBeforeTime,
  minutesPerDay,
} from "@/types/FantasyCalendar";
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import Prando from "prando";
import { getTimeFromServer, setTimeOnServer } from "@/server/Server";
import { useCampaignData } from "@/server/ClientUtility";

const pad = (num: number, size: number) => {
  let numStr = num.toString();
  while (numStr.length < size) numStr = "0" + numStr;
  return numStr;
};

const Bubble = (props: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={
        "flex min-w-10 flex-col items-center justify-center rounded-xl bg-french-900/80 p-1 px-2 text-white shadow-xl " +
        props.className
      }
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const OPACITY_MOD = 0.5;

export const Calendar = (props: { admin?: boolean }) => {
  const { campaignData, isLoading } = useCampaignData();

  if (!campaignData) return <div className="grow"></div>;

  const CAL = campaignData!.calendar as FantasyCalendar;
  const time = campaignData!.calendar!.currentDate as FantasyCalendarDate;

  const sunriseSunset = getSunriseAndSunsetForDate(CAL, time);

  const beforeSunrise = isBeforeTime(CAL, time, sunriseSunset.sunrise);
  const afterSunset = !isBeforeTime(CAL, time, sunriseSunset.sunset);
  const daylight = !beforeSunrise && !afterSunset;
  const suntime = distanceInMinutes(
    CAL,
    sunriseSunset.sunrise,
    sunriseSunset.sunset,
  );
  const minutes = minutesPerDay(CAL);

  let progress = 0;
  let nightTime = 0;
  if (daylight) {
    progress = distanceInMinutes(CAL, sunriseSunset.sunrise, time);
  } else if (beforeSunrise) {
    const prevDay = incrementDay(CAL, time);
    const prevSunriseSunset = getSunriseAndSunsetForDate(CAL, prevDay);
    const midnight = { hour: 0, minute: 0 };
    const minutesUntilMidnight =
      minutes - distanceInMinutes(CAL, prevSunriseSunset.sunset, midnight);
    progress = minutesUntilMidnight + distanceInMinutes(CAL, midnight, time);
    nightTime =
      minutesUntilMidnight +
      distanceInMinutes(CAL, sunriseSunset.sunrise, midnight);
  } else {
    const midnight = { hour: 0, minute: 0 };
    const minutesUntilMidnight =
      minutes - distanceInMinutes(CAL, sunriseSunset.sunset, midnight);

    progress =
      minutesUntilMidnight - (minutes - distanceInMinutes(CAL, time, midnight));

    nightTime =
      minutesUntilMidnight +
      (minutes - distanceInMinutes(CAL, midnight, sunriseSunset.sunset));
  }

  let dawnOpacity = 0;
  let noonOpacity = 0;
  let duskOpacity = 0;
  let midnightOpacity = 0;

  if (daylight) {
    midnightOpacity = 0;
    noonOpacity = 1;
    const sunprogress = progress / suntime;
    if (sunprogress <= 0.25) {
      dawnOpacity = 1 - sunprogress * 4;
    } else if (sunprogress <= 0.75) {
    } else {
      duskOpacity = (sunprogress - 0.75) * 4;
    }
  } else {
    noonOpacity = 0;
    midnightOpacity = 1;
    const sunprogress = progress / nightTime;
    if (sunprogress <= 0.25) {
      duskOpacity = 1 - sunprogress * 4;
    } else if (sunprogress <= 0.75) {
    } else {
      dawnOpacity = (sunprogress - 0.75) * 4;
    }
  }

  dawnOpacity *= OPACITY_MOD * OPACITY_MOD;
  noonOpacity *= OPACITY_MOD * OPACITY_MOD;
  duskOpacity *= OPACITY_MOD;
  midnightOpacity *= OPACITY_MOD;

  const sunProgress = progress / suntime;
  const nightProgress = progress / nightTime;

  const gen = new Prando(time.year + time.month + time.day);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl">
      <div
        className={[
          "relative h-0 grow overflow-hidden",
          "transition-[background] duration-1000 ease-in-out",
        ].join(" ")}
      >
        <div
          className="noon linear absolute bottom-0 left-0 right-0 top-0 transition-all duration-1000"
          style={{
            opacity: noonOpacity,
          }}
        >
          {" "}
          &nbsp;
        </div>
        <div
          className="midnight linear absolute bottom-0 left-0 right-0 top-0 transition-all duration-1000"
          style={{
            opacity: midnightOpacity,
          }}
        >
          &nbsp;
        </div>
        <div
          className="dawn linear absolute bottom-0 left-0 right-0 top-0 transition-all duration-1000"
          style={{
            opacity: dawnOpacity,
          }}
        >
          &nbsp;
        </div>
        <div
          className="dusk linear absolute bottom-0 left-0 right-0 top-0 transition-all duration-1000"
          style={{
            opacity: duskOpacity,
          }}
        >
          &nbsp;
        </div>

        <div
          className="sun z-0 h-8 w-8 transition-all duration-1000 ease-in-out"
          style={{
            left: `${
              beforeSunrise ? 0 : afterSunset ? 100 : (progress / suntime) * 100
            }%`,
            top: `${
              daylight ? ((progress / suntime - 0.5) * 2) ** 2 * 30 : 150
            }%`,
            transform: "translate(-50%, 100%)",
          }}
        />

        <div
          className="transition-all duration-1000 ease-in-out"
          style={{
            opacity: daylight
              ? sunProgress <= 0.25
                ? dawnOpacity / 2 + 0.1
                : sunProgress <= 0.75
                  ? 0.1
                  : duskOpacity / 2 + 0.1
              : nightProgress <= 0.25
                ? 1 - duskOpacity + 0.2
                : nightProgress <= 0.75
                  ? 1
                  : 1 - dawnOpacity + 0.2,
          }}
        >
          <div
            className="absolute flex gap-2"
            style={{
              left: `${50}%`,
              top: `${10}%`,
              transform: "translate(-50%, 100%)",
            }}
          >
            {CAL.static_data.moons.map((_moon: any, i: number) => {
              const phaseProgress = getMoonCycleProgressForMoon(CAL, time, i);
              let phase = 0;
              if (phaseProgress <= 0.5) {
                phase = phaseProgress * 2;
              } else {
                phase = (phaseProgress - 0.5) * 2 - 1;
              }

              return (
                <svg width="26" height="26" className="" key={i}>
                  <defs>
                    <mask id="hole">
                      <rect width="100%" height="100%" fill="white" />
                      <circle
                        r="11"
                        cx={`${phase * 22 + 13}`}
                        cy="13"
                        fill="black"
                      />
                    </mask>
                  </defs>

                  <circle r="9.5" cx="13" cy="13" fill="#111111" />
                  <circle
                    r="10"
                    cx="13"
                    cy="13"
                    mask="url(#hole)"
                    fill="white"
                    opacity={1}
                  />
                </svg>
              );
            })}
          </div>

          {new Array(100).fill(0).map((_, i) => (
            <div
              key={i}
              className="star z-0 h-1 w-1 transition-all duration-100 ease-in-out"
              style={{
                left: `${gen.next() * 100}%`,
                top: `${gen.next() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-50 flex flex-col gap-4 p-2">
        <div className="flex justify-between gap-4 text-center">
          <Bubble>
            <div className="p-2 px-3">
              {time.day}. {getMonthName(CAL, time.month)} {time.year}
            </div>
          </Bubble>
          <Bubble>
            <div className="p-2 px-3">{getWeekdayName(CAL, time)}</div>
          </Bubble>
          {props.admin ? (
            <Bubble>
              <div className="p-2 px-3">
                {pad(time.hour, 2)}:{pad(time.minute, 2)}
              </div>
            </Bubble>
          ) : (
            <></>
          )}
        </div>
        {props.admin ? (
          <Bubble className="grid grid-cols-2 grid-rows-1 justify-center border-black text-xs">
            <div className="flex w-full flex-row-reverse justify-end gap-2 p-2">
              <button
                className="rounded-full bg-french-400 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  let newDate = structuredClone(time);
                  newDate.minute = newDate.minute - 10;
                  if (newDate.minute < 0) {
                    newDate.minute =
                      CAL.static_data.clock.minutes + newDate.minute;
                    newDate.hour = newDate.hour - 1;
                    if (newDate.hour < 0) {
                      newDate.hour = CAL.static_data.clock.hours - 1;
                      newDate = decrementDay(CAL, newDate);
                    }
                  }
                  setTimeOnServer(newDate);
                }}
              >
                -10m
              </button>
              <button
                className="rounded-full bg-french-500 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  let newDate = structuredClone(time);
                  newDate.hour = newDate.hour - 1;
                  if (newDate.hour < 0) {
                    newDate.hour = CAL.static_data.clock.hours - 1;
                    newDate = decrementDay(CAL, newDate);
                  }
                  setTimeOnServer(newDate);
                }}
              >
                -1h
              </button>
              <button
                className="rounded-full bg-french-600 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  const newDate = decrementDay(CAL, time);
                  setTimeOnServer(newDate);
                }}
              >
                -1d
              </button>
            </div>
            <div className="flex w-full flex-row-reverse justify-start gap-2 p-2">
              <button
                className="rounded-full bg-french-600 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  const newDate = incrementDay(CAL, time);
                  setTimeOnServer(newDate);
                }}
              >
                +1d
              </button>
              <button
                className="rounded-full bg-french-500 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  let newDate = structuredClone(time);
                  newDate.hour = newDate.hour + 1;
                  if (newDate.hour >= CAL.static_data.clock.hours) {
                    newDate.hour = 0;
                    newDate = incrementDay(CAL, newDate);
                  }
                  setTimeOnServer(newDate);
                }}
              >
                +1h
              </button>
              <button
                className="rounded-full bg-french-400 p-1 px-2 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => {
                  let newDate = structuredClone(time);
                  newDate.minute = newDate.minute + 10;

                  if (newDate.minute >= CAL.static_data.clock.minutes) {
                    newDate.minute = 0;
                    newDate.hour = newDate.hour + 1;
                    if (newDate.hour >= CAL.static_data.clock.hours) {
                      newDate.hour = 0;
                      newDate = incrementDay(CAL, newDate);
                    }
                  }
                  setTimeOnServer(newDate);
                }}
              >
                +10m
              </button>
            </div>
          </Bubble>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Calendar;
