import fetch from "node-fetch";
import { HOLIDAYS_URL } from "../config/config";

export async function getHolidays(): Promise<string[]> {
  try {
    const res = await fetch(HOLIDAYS_URL);
    if (!res.ok) {
      console.warn("No se pudo obtener el JSON de festivos, status:", res.status);
      return [];
    }
    const data = await res.json();

    // data es directamente string[]
    if (!Array.isArray(data)) {
      console.warn("Formato de festivos inesperado:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.warn("Error al obtener días festivos:", err);
    return [];
  }
}

 
