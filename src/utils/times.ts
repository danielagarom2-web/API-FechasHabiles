import { DateTime } from "luxon";
import { WORKING_HOURS, COLOMBIA_TZ } from "../config/config";
import { ColombiaDateTime } from "../types/types";
import { getHolidays } from "./holidays";

/**
 * Suma días hábiles, saltando fines de semana y festivos
 */
export async function addBusinessDays(
  dt: ColombiaDateTime,
  days: number
): Promise<ColombiaDateTime> {
  const holidays = await getHolidays();
  let current = dt;

  while (days > 0) {
    current = current.plus({ days: 1 });
    const weekday = current.weekday; // 1=lunes ... 7=domingo
    const isoDate = current.toISODate();

    if (!isoDate) continue;

    if (weekday >= 1 && weekday <= 5 && !holidays.includes(isoDate)) {
      days -= 1;
    }
  }

  return current;
}

/**
 * Suma horas hábiles, respetando horario laboral, almuerzo, fines de semana y festivos
 */
// Sumar horas hábiles, respetando horario laboral, almuerzo y días hábiles
export async function addWorkingHours(
  dt: ColombiaDateTime,
  hours: number
): Promise<ColombiaDateTime> {
  const holidays = await getHolidays();
  let current = dt;

  while (hours > 0) {
    const weekday = current.weekday;
    const isoDate = current.toISODate();

    // Saltar días no hábiles
    if (!isoDate || weekday > 5 || holidays.includes(isoDate)) {
      current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
      continue;
    }

    let hour = current.hour;

    // Antes de iniciar jornada
    if (hour < WORKING_HOURS.start) {
      current = current.set({ hour: WORKING_HOURS.start, minute: 0 });
      hour = WORKING_HOURS.start;
    }

    // Después de jornada → saltar al siguiente día hábil
    if (hour >= WORKING_HOURS.end) {
      current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0 });
      continue;
    }

    // Almuerzo: si estamos justo antes de almuerzo y sumar horas llegaría al almuerzo
    if (hour < WORKING_HOURS.lunchStart && hour + hours > WORKING_HOURS.lunchStart) {
      const delta = WORKING_HOURS.lunchStart - hour;
      current = current.plus({ hours: delta });
      hours -= delta;
      current = current.set({ hour: WORKING_HOURS.lunchEnd, minute: 0 }); // saltamos almuerzo
      continue;
    }

    // Cuántas horas puedo sumar hoy hasta fin de jornada o almuerzo
    const endHour = hour < WORKING_HOURS.lunchStart ? WORKING_HOURS.lunchStart : WORKING_HOURS.end;
    const available = endHour - hour;
    const increment = Math.min(available, hours);

    current = current.plus({ hours: increment });
    hours -= increment;

    // Si llegamos a almuerzo o fin de jornada → ajustar
    if (current.hour === WORKING_HOURS.lunchStart) {
      current = current.set({ hour: WORKING_HOURS.lunchEnd, minute: 0 });
    }
    if (current.hour >= WORKING_HOURS.end) {
      current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0 });
    }
  }

  return current;
}

/**
 * Función principal para calcular fecha futura
 */
export async function calculateFutureDate(
  days?: number,
  hours?: number,
  date?: string
): Promise<ColombiaDateTime> {
  let dt: ColombiaDateTime;

  if (date) {
    dt = DateTime.fromISO(date, { zone: COLOMBIA_TZ });
  } else {
    dt = DateTime.now().setZone(COLOMBIA_TZ);
  }

  if (days && days > 0) {
    dt = await addBusinessDays(dt, days);
  }

  if (hours && hours > 0) {
    dt = await addWorkingHours(dt, hours);
  }

  return dt;
}





