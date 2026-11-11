export const BOOKING_TIME_ZONE = "Africa/Johannesburg";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function getDatePartsInTimeZone(date = new Date(), timeZone = BOOKING_TIME_ZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

export function getTodayInBookingTimeZone(date = new Date()) {
  const { year, month, day } = getDatePartsInTimeZone(date);
  return `${year}-${month}-${day}`;
}

export function isValidBookingDateValue(value) {
  if (typeof value !== "string") return false;
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;

  const roundTrip = new Date(Date.UTC(year, month - 1, day));
  return (
    roundTrip.getUTCFullYear() === year &&
    roundTrip.getUTCMonth() === month - 1 &&
    roundTrip.getUTCDate() === day
  );
}

export function isPastBookingDate(value, now = new Date()) {
  if (!isValidBookingDateValue(value)) return false;
  return value < getTodayInBookingTimeZone(now);
}

export function getBookingClockMinutes(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );

  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  return hour * 60 + minute;
}

export function bookingDateTimeToInstant(dateValue, timeValue) {
  if (!isValidBookingDateValue(dateValue) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(timeValue || "")) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(localAsUtc)).map((part) => [part.type, part.value]),
  );
  const representedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  );

  return new Date(localAsUtc - (representedAsUtc - localAsUtc));
}

export function isElapsedStartTimeForDate(dateValue, startMinutes, now = new Date()) {
  if (dateValue !== getTodayInBookingTimeZone(now)) return false;
  const currentMinutes = getBookingClockMinutes(now);
  if (currentMinutes === null) return false;
  return startMinutes <= currentMinutes;
}
