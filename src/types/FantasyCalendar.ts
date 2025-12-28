/**
 * Type Specification from Fantasy Calendar
 * ! might not be complete or 100% accurate
 * todo: Write tests for the calendar operations
 */

export type FantasyCalendar = {
  name: string;
  static_data: {
    year_data: {
      first_day: number;
      overflow: boolean;
      global_week: string[];
      timespans: {
        name: string;
        type: string;
        length: number;
        interval: number;
        offset: number;
      }[];
      leap_days: any;
    };
    moons: {
      name: string;
      cycle: number;
      cycle_rounding: string;
      shift: number;
      granularity: number;
      color: string;
      shadow_color: string;
      hidden: boolean;
    }[];
    clock: {
      hours: number;
      minutes: number;
      offset: number;
      crowding: number;
    };
    seasons: {
      data: {
        name: string;
        color: string[];
        time: {
          sunrise: {
            hour: number;
            minute: number;
          };
          sunset: {
            hour: number;
            minute: number;
          };
        };
        timespan: number; // starting month
        day: number; // starting day in that month
        gradient: {
          start: number[];
          end: number[];
        };
      }[];
    };
  };
};

export type FantasyCalendarDate = {
  year: number;
  month: number;
  day: number;
} & FantasyCalendarTime;

export type FantasyCalendarTime = {
  hour: number;
  minute: number;
};

export const isBeforeTime = (
  _calendar: FantasyCalendar,
  time1: FantasyCalendarTime,
  time2: FantasyCalendarTime,
) => {
  if (time1.hour < time2.hour) {
    return true;
  } else if (time1.hour > time2.hour) {
    return false;
  }

  if (time1.minute < time2.minute) {
    return true;
  } else if (time1.minute > time2.minute) {
    return false;
  }

  return false;
};

export const distanceInMinutes = (
  calendar: FantasyCalendar,
  date1: FantasyCalendarTime,
  date2: FantasyCalendarTime,
) => {
  const earlierTime = isBeforeTime(calendar, date1, date2) ? date1 : date2;
  const laterTime = isBeforeTime(calendar, date1, date2) ? date2 : date1;

  let minutes = 0;
  minutes +=
    (laterTime.hour - earlierTime.hour) * calendar.static_data.clock.minutes;
  minutes += laterTime.minute - earlierTime.minute;
  return minutes;
};

export const daysPerYear = (calendar: FantasyCalendar) => {
  let days = 0;
  for (let month of calendar.static_data.year_data.timespans) {
    days += month.length;
  }
  return days;
};

export const getMonthName = (calendar: FantasyCalendar, month: number) => {
  return calendar.static_data.year_data.timespans[month - 1].name;
};

export const isBefore = (
  calendar: FantasyCalendar,
  date1: FantasyCalendarDate,
  date2: FantasyCalendarDate,
) => {
  if (date1.year < date2.year) {
    return true;
  } else if (date1.year > date2.year) {
    return false;
  }

  if (date1.month < date2.month) {
    return true;
  } else if (date1.month > date2.month) {
    return false;
  }

  if (date1.day < date2.day) {
    return true;
  } else if (date1.day > date2.day) {
    return false;
  }

  if (date1.hour < date2.hour) {
    return true;
  } else if (date1.hour > date2.hour) {
    return false;
  }

  if (date1.minute < date2.minute) {
    return true;
  } else if (date1.minute > date2.minute) {
    return false;
  }

  return false;
};

export const getSeasonForDate = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  let currentSeason =
    calendar.static_data.seasons.data[
      calendar.static_data.seasons.data.length - 1
    ];
  for (let season of calendar.static_data.seasons.data) {
    if (
      isBefore(calendar, date, {
        year: date.year,
        month: season.timespan,
        day: season.day,
        hour: season.time.sunrise.hour,
        minute: season.time.sunrise.minute,
      })
    ) {
      break;
    }
    currentSeason = season;
  }
  return currentSeason;
};

export const getSeasonLength = (calendar: FantasyCalendar, season: any) => {
  const seasonIndex = calendar.static_data.seasons.data.indexOf(season);
  const nextSeason =
    calendar.static_data.seasons.data[
      (seasonIndex + 1) % calendar.static_data.seasons.data.length
    ];

  let days = 0;
  for (let i = 0; i < calendar.static_data.year_data.timespans.length; i++) {
    let j =
      (i + season.timespan) % calendar.static_data.year_data.timespans.length;

    if (season.timespan === j) {
      days += calendar.static_data.year_data.timespans[j].length - season.day;
    } else if (nextSeason.timespan === j) {
      days += nextSeason.day;
      break;
    } else {
      days += calendar.static_data.year_data.timespans[j].length;
    }
  }
  return days;
};

export const getDayInSeason = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  const season = getSeasonForDate(calendar, date)!;
  const seasonIndex = calendar.static_data.seasons.data.indexOf(season);
  const nextSeason =
    calendar.static_data.seasons.data[
      (seasonIndex + 1) % calendar.static_data.seasons.data.length
    ];

  let days = 0;
  for (let i = 0; i < calendar.static_data.year_data.timespans.length; i++) {
    let j =
      (i + season.timespan) % calendar.static_data.year_data.timespans.length;

    if (j == date.month - 1) {
      // This is the month we're looking for
      if (j == season.timespan) {
        // This is the first month of the season
        days += date.day - season.day;
      } else {
        days += date.day;
      }
      break;
    } else {
      if (season.timespan === j) {
        days += calendar.static_data.year_data.timespans[j].length - season.day;
      } else if (nextSeason.timespan === j) {
        days += nextSeason.day;
        break;
      } else {
        days += calendar.static_data.year_data.timespans[j].length;
      }
    }
  }
  return days;
};

export const incrementDay = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  const newDate = { ...date };
  newDate.day++;
  if (
    newDate.day >
    calendar.static_data.year_data.timespans[newDate.month - 1].length
  ) {
    newDate.day = 1;
    newDate.month++;
    if (newDate.month > calendar.static_data.year_data.timespans.length) {
      newDate.month = 1;
      newDate.year++;
    }
  }
  return newDate;
};

export const getMoonCycleProgressForMoon = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
  moonIndex: number,
) => {
  const daysPerYear = calendar.static_data.year_data.timespans.reduce(
    (acc, val) => acc + val.length,
    0,
  );
  const moon = calendar.static_data.moons[moonIndex];
  let daysPassedTotal = (date.year - 1) * daysPerYear + date.day;
  for (let i = 0; i < date.month - 1; i++) {
    daysPassedTotal += calendar.static_data.year_data.timespans[i].length;
  }
  const daysPassed = daysPassedTotal % moon.cycle;
  return (daysPassed + moon.shift) / moon.cycle;
};

export const decrementDay = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  const newDate = { ...date };
  newDate.day--;
  if (newDate.day < 1) {
    newDate.month--;
    if (newDate.month < 1) {
      newDate.month = calendar.static_data.year_data.timespans.length;
      newDate.year--;
    }
    newDate.day =
      calendar.static_data.year_data.timespans[newDate.month - 1].length;
  }
  return newDate;
};

export const minutesPerDay = (calendar: FantasyCalendar) => {
  return calendar.static_data.clock.hours * calendar.static_data.clock.minutes;
};

export const daysPassedSoFar = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  let days = 0;
  for (let i = 0; i < date.month - 1; i++) {
    days += calendar.static_data.year_data.timespans[i].length;
  }
  days += date.day - 1;

  const daysPerYear = calendar.static_data.year_data.timespans.reduce(
    (acc, val) => acc + val.length,
    0,
  );

  days += (date.year - 1) * daysPerYear;

  return days;
};

export const getWeekdayName = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  const daysPassed = daysPassedSoFar(calendar, date);
  const weekday =
    daysPassed % calendar.static_data.year_data.global_week.length;
  return calendar.static_data.year_data.global_week[weekday];
};

export const lerpTime = (
  calendar: FantasyCalendar,
  time1: FantasyCalendarTime,
  time2: FantasyCalendarTime,
  progress: number,
) => {
  let minHour = Math.min(time1.hour, time2.hour);
  let maxHour = Math.max(time1.hour, time2.hour);

  let minMinute = Math.min(time1.minute, time2.minute);
  let maxMinute = Math.max(time1.minute, time2.minute);

  let hour = minHour + (maxHour - minHour) * progress;
  let minute = minMinute + (maxMinute - minMinute) * progress;

  // add overflowing minutes to hour
  hour += Math.floor(minute / calendar.static_data.clock.minutes);
  // turn minute float to int
  minute = Math.floor(minute);

  // get hour float part
  const hourFloat = hour % 1;
  // get hour int part
  hour = Math.floor(hour);

  // turn hour float to int
  const tmpMinute = Math.floor(hourFloat * calendar.static_data.clock.minutes);
  // add overflowing minutes to minute
  minute += tmpMinute;

  // add overflowing minutes to hour
  hour += Math.floor(minute / calendar.static_data.clock.minutes);
  // turn minute float to int
  minute = Math.floor(minute);

  return {
    hour,
    minute,
  };
};

export const getSunriseAndSunsetForDate = (
  calendar: FantasyCalendar,
  date: FantasyCalendarDate,
) => {
  const currentSeason = getSeasonForDate(calendar, date)!;
  const seasonIndex = calendar.static_data.seasons.data.indexOf(currentSeason);
  const nextSeason =
    calendar.static_data.seasons.data[
      (seasonIndex + 1) % calendar.static_data.seasons.data.length
    ];

  const seasonLength = getSeasonLength(calendar, currentSeason);
  const dayInSeason = getDayInSeason(calendar, date);
  const seasonProgress = dayInSeason / seasonLength;

  const currSunrise = currentSeason.time.sunrise;
  const currSunset = currentSeason.time.sunset;
  const nextSunrise = nextSeason.time.sunrise;
  const nextSunset = nextSeason.time.sunset;

  // linear interpolate between two times

  const sunrise = lerpTime(calendar, currSunrise, nextSunrise, seasonProgress);

  const sunset = lerpTime(calendar, currSunset, nextSunset, seasonProgress);

  return {
    sunrise,
    sunset,
  };
};
