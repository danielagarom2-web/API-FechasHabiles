import { DateTime } from "luxon";
import { WORKING_HOURS, COLOMBIA_TZ } from "../config/config";
import { ColombiaDateTime } from "../types/types";
import { getHolidays } from "./holidays";

/**
 * Ajusta una fecha hacia atrás al horario laboral más cercano en Colombia.
 */
function adjustToWorkingTime(dt: ColombiaDateTime, holidays: string[]): ColombiaDateTime {
  let current = dt.setZone(COLOMBIA_TZ);

  // Retroceder si está en fin de semana o festivo
  while (current.weekday > 5 || holidays.includes(current.toISODate()!)) {
    current = current.minus({ days: 1 }).set({ hour: WORKING_HOURS.end, minute: 0, second: 0 });
  }

  // Ajustar si está fuera del horario laboral
  const hour = current.hour;
  if (hour < WORKING_HOURS.start) {
    current = current.set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
  } else if (hour >= WORKING_HOURS.end) {
    current = current.set({ hour: WORKING_HOURS.end, minute: 0, second: 0 });
  } else if (hour >= WORKING_HOURS.lunchStart && hour < WORKING_HOURS.lunchEnd) {
    current = current.set({ hour: WORKING_HOURS.lunchStart, minute: 0, second: 0 });
  }

  return current;
}

/**
 * Suma días hábiles (manteniendo hora original si es válida)
 */
export async function addBusinessDays(
  dt: ColombiaDateTime,
  days: number
): Promise<ColombiaDateTime> {
  const holidays = await getHolidays();
  let current = dt.setZone(COLOMBIA_TZ);

  while (days > 0) {
    current = current.plus({ days: 1 });
    const weekday = current.weekday;
    const isoDate = current.toISODate();

    if (!isoDate) continue;

    // Día hábil válido
    if (weekday >= 1 && weekday <= 5 && !holidays.includes(isoDate)) {
      days -= 1;
    }
  }

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

    // Si es fin de semana o festivo, saltar al siguiente día hábil
    if (!isoDate || weekday > 5 || holidays.has(isoDate)) {
      current = current.plus({ days: 1 }).set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
      continue;
    }

    // Ajustar si antes del inicio laboral
    if (current.hour < WORKING_HOURS.start) {
      current = current.set({ hour: WORKING_HOURS.start, minute: 0, second: 0 });
    }

    // Determinar bloque válido de trabajo
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

      // Saltar almuerzo o pasar al siguiente día
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
 * Calcula la fecha futura con días y/o horas hábiles desde UTC → Colombia
 */
export async function calculateFutureDate(
  days?: number,
  hours?: number,
  date?: string
): Promise<DateTime> {
  const holidays = await getHolidays();

  let dt = date
    ? DateTime.fromISO(date, { zone: "utc" }).setZone(COLOMBIA_TZ)
    : DateTime.now().setZone(COLOMBIA_TZ);
  dt = adjustToWorkingTime(dt, holidays);

  if (days && days > 0) {
    dt = await addBusinessDays(dt, days);
  }

  if (hours && hours > 0) {
    dt = await addWorkingHours(dt, hours);
  }
  return dt.setZone("utc");
}
