import fetch, { Response } from "node-fetch";
import { HOLIDAYS_URL } from "../config/config";

export type HolidayResponse = {
  holidays: string[];
};

let cachedHolidays: string[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS: number = 1000 * 60 * 60 * 24; 

export async function getHolidays(): Promise<string[]> {
  if (cachedHolidays && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION_MS) {
    return cachedHolidays;
  }

  try {
    const res: Response = await fetch(HOLIDAYS_URL); 
    if (!res.ok) {
      console.warn("No se pudo obtener el JSON de festivos, status:", res.status);
      return cachedHolidays ?? [];
    }

    const data: unknown = await res.json();

    let holidays: string[] | null = null;

    if (Array.isArray(data) && data.every((d) => typeof d === "string")) {
      holidays = data as string[];
    } else if (
      typeof data === "object" &&
      data !== null &&
      "holidays" in data &&
      Array.isArray((data as HolidayResponse).holidays) &&
      (data as HolidayResponse).holidays.every((d) => typeof d === "string")
    ) {
      holidays = (data as HolidayResponse).holidays;
    }

    if (!holidays) {
      console.warn("Formato de festivos inesperado:", data);
      return cachedHolidays ?? [];
    }

    cachedHolidays = holidays;
    lastFetchTime = Date.now();

    return cachedHolidays;
  } catch (err: unknown) {
    console.warn("Error al obtener días festivos:", err);
    return cachedHolidays ?? [];
  }
}


