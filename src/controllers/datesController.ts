import { Request, Response } from "express";
import { DatesService } from "../services/datesService";
import { DateTime } from "luxon";
import { COLOMBIA_TZ } from "../config/config";

export class DatesController {
  private readonly service: DatesService;

  constructor() {
    this.service = new DatesService();
  }

  public async getBusinessDays(req: Request, res: Response): Promise<Response> {
    try {
      const { days: daysParam, hours: hoursParam, date: dateParam } = req.query;

      const days = daysParam ? parseInt(daysParam as string, 10) : 0;
      const hours = hoursParam ? parseInt(hoursParam as string, 10) : 0;

      if (
        (daysParam && (isNaN(days) || days < 0)) ||
        (hoursParam && (isNaN(hours) || hours < 0))
      ) {
        return res.status(400).json({
          error: "InvalidParameters",
          message: "Los parámetros 'days' y 'hours' deben ser números enteros positivos.",
        });
      }

      let startDate: string | undefined = undefined;
      if (dateParam) {
      const dateStr = dateParam as string;

      // Verificar que termina con Z
      if (!dateStr.endsWith("Z")) {
        return res.status(400).json({
          error: "InvalidParameters",
          message: "El parámetro 'date' debe estar en UTC ISO 8601 y terminar con 'Z'.",
        });
      }

      const dt = DateTime.fromISO(dateStr, { zone: "utc" });
      if (!dt.isValid) {
        return res.status(400).json({
          error: "InvalidParameters",
          message: "El parámetro 'date' debe tener formato ISO 8601 válido (ej: 2025-08-01T14:00:00Z).",
        });
      }

      startDate = dt.toISO(); // Mantiene el Z
    }

      if (!days && !hours) {
        const base = startDate
          ? DateTime.fromISO(startDate, { zone: COLOMBIA_TZ })
          : DateTime.now().setZone(COLOMBIA_TZ);

        return res.status(200).json({
          date: base.toUTC().toISO({ suppressMilliseconds: true }),
        });
      }


      const futureDate = await this.service.getFutureBusinessDate(days, hours, startDate);


      return res.status(200).json({
        date: futureDate.toUTC().toISO({ suppressMilliseconds: true }),
      });
    } catch (err: any) {
      console.error("❌ Error interno:", err);
      return res.status(503).json({
        error: "ServiceUnavailable",
        message: "Ocurrió un error al procesar la solicitud. Intente más tarde.",
      });
    }
  }
}






