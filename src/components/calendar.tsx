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
import { fetchCampaignState, updateCampaignState } from "@/server/server";
import { useCampaignMeta, useCampaignState } from "@/server/client-utility";

const pad = (num: number, size: number) => {
  let numStr = num.toString();
  while (numStr.length < size) numStr = "0" + numStr;
  return numStr;
};

const OPACITY_MOD = 0.5;

export const Calendar = (props: { admin?: boolean }) => {
  const { campaignMeta } = useCampaignMeta();
  const { campaignState } = useCampaignState();

  if (!campaignState) return <div className="grow"></div>;
  if (!campaignMeta) return <div className="grow"></div>;

  const CAL = campaignMeta?.calendar as FantasyCalendar;
  const time = campaignState?.currentDate;

  if (!CAL) return undefined;
  if (!time) return undefined;

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
    <div className="flex w-full flex-col overflow-hidden rounded-3xl">
      <div className="flex w-full bg-white/90">
        <div className="flex h-20 w-3/4 flex-col">
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
                  beforeSunrise
                    ? 0
                    : afterSunset
                      ? 100
                      : (progress / suntime) * 100
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
        </div>
        <div className="midnight opacity-90 flex h-20 grow items-center justify-center p-4">
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
      </div>

      <div className="flex w-full items-center justify-between gap-4 bg-black/80 p-4 font-bold text-french-400">
        <span>
          {time.day}. {getMonthName(CAL, time.month)} 
           {/* {time.year} */}
        </span>
        <span>{getWeekdayName(CAL, time)}</span>
        {props.admin ? (
          <span>
            {pad(time.hour, 2)}:{pad(time.minute, 2)}
          </span>
        ) : (
          <></>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        {props.admin ? (
          <div className="flex w-full justify-center gap-1 p-2">
            <button
              className="rounded-full bg-french-600 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
              onClick={() => {
                const newDate = decrementDay(CAL, time);
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              -1d
            </button>
            <button
              className="rounded-full bg-french-500 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
              onClick={() => {
                let newDate = structuredClone(time);
                newDate.hour = newDate.hour - 1;
                if (newDate.hour < 0) {
                  newDate.hour = CAL.static_data.clock.hours - 1;
                  newDate = decrementDay(CAL, newDate);
                }
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              -1h
            </button>
            <button
              className="rounded-full bg-french-400 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
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
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              -10m
            </button>
            <button
              className="rounded-full bg-french-400 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
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
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              +10m
            </button>

            <button
              className="rounded-full bg-french-500 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
              onClick={() => {
                let newDate = structuredClone(time);
                newDate.hour = newDate.hour + 1;
                if (newDate.hour >= CAL.static_data.clock.hours) {
                  newDate.hour = 0;
                  newDate = incrementDay(CAL, newDate);
                }
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              +1h
            </button>
            <button
              className="rounded-full bg-french-600 p-1 px-3 text-french-900 transition-all duration-200 ease-in-out hover:scale-110"
              onClick={() => {
                const newDate = incrementDay(CAL, time);
                updateCampaignState({
                  currentDate: newDate,
                });
              }}
            >
              +1d
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Calendar;
