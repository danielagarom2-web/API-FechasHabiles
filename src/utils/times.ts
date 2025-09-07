import { DateTime } from "luxon";
import { WORKING_HOURS, COLOMBIA_TZ } from "../config/config";
import { ColombiaDateTime } from "../types/types";
import { getHolidays } from "./holidays";

/**
 * Suma días hábiles, respetando fines de semana y festivos.
 * Ajusta la hora solo si la fecha inicial estaba fuera de jornada.
 */
export async function addBusinessDays(
  dt: ColombiaDateTime,
  days: number
): Promise<ColombiaDateTime> {
  const holidays = await getHolidays();
  let current = dt;

  while (days > 0) {
    current = current.plus({ days: 1 });
    const weekday = current.weekday; 
    const isoDate = current.setZone(COLOMBIA_TZ).toISODate();

    if (!isoDate) continue;

    if (weekday >= 1 && weekday <= 5 && !holidays.includes(isoDate)) {
      days -= 1;
    }
  }

  let hour = current.hour;
  if (hour >= WORKING_HOURS.lunchStart && hour < WORKING_HOURS.lunchEnd) {
    hour = WORKING_HOURS.lunchStart; 
  } else if (hour >= WORKING_HOURS.end) {
    hour = WORKING_HOURS.end; 
  }
  current = current.set({ hour, minute: 0, second: 0 });

  return current.setZone(COLOMBIA_TZ);
}

/**
 * Suma horas hábiles respetando jornada, almuerzo, fines de semana y festivos
 */
export async function addWorkingHours(
  dt: ColombiaDateTime,
  hours: number
): Promise<ColombiaDateTime> {
  const holidaysArr = await getHolidays();
  const holidays = new Set(
    holidaysArr.map(d => DateTime.fromISO(d).setZone(COLOMBIA_TZ).toISODate())
  );

  let current = dt.setZone(COLOMBIA_TZ);

  while (hours > 0) {
    const weekday = current.weekday;
    const isoDate = current.toISODate();

    if (!isoDate || weekday > 5 || holidays.has(isoDate)) {
      current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
      continue;
    }

    if (current.hour < WORKING_HOURS.start) {
      current = current.set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
    }

    const blockStart = current.hour + current.minute / 60;
    let blockEnd = current.hour < WORKING_HOURS.lunchStart ? WORKING_HOURS.lunchStart : WORKING_HOURS.end;
    const available = blockEnd - blockStart;

    if (hours <= available) {
      const newHour = Math.floor(blockStart + hours);
      const newMinute = Math.round((blockStart + hours - newHour) * 60);
      current = current.set({ hour: newHour, minute: newMinute, second: 0 });
      break;
    } else {
      hours -= available;
      current = current.set({ hour: blockEnd, minute: 0, second: 0 });
      if (blockEnd === WORKING_HOURS.lunchStart) {
        current = current.set({ hour: WORKING_HOURS.lunchEnd, minute: 0, second: 0 });
      } else if (blockEnd === WORKING_HOURS.end) {
        current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
      }
    }
  }

  return current.setZone(COLOMBIA_TZ);
}

/**
 * Calcula fecha futura con días y horas hábiles
 */
export async function calculateFutureDate(
  days?: number,
  hours?: number,
  date?: string
): Promise<ColombiaDateTime> {
  let dt: ColombiaDateTime;

  if (date) {
    dt = DateTime.fromISO(date).setZone(COLOMBIA_TZ);
  } else {
    dt = DateTime.now().setZone(COLOMBIA_TZ);
  }

  if (days && days > 0) {
    dt = await addBusinessDays(dt, days);
  }

  if (hours && hours > 0) {
    dt = await addWorkingHours(dt, hours);
  }

  return dt.setZone(COLOMBIA_TZ);
}











