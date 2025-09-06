import { DateTime } from "luxon";

export interface WorkingHours {
  start: number;
  lunchStart: number;
  lunchEnd: number;
  end: number;
}

export interface HolidayResponse {
  holidays: string[]; // Lista de fechas 
}

export interface AddWorkingTimeParams {
  days?: number;
  hours?: number;
  date?: string; // Fecha inicial en formato UTC ISO 8601
}

export type ColombiaDateTime = DateTime;
