import { Request, Response } from "express";
import { DatesService } from "../services/datesService";

export class DatesController {
  private readonly service: DatesService;

  constructor() {
    this.service = new DatesService();
  }

  public async getBusinessDays(req: Request, res: Response): Promise<Response> {
    try {
      const daysParam = req.query.days;
      const hoursParam = req.query.hours;
      const dateParam = req.query.date as string | undefined;

      // Validación de parámetros obligatorios
      if (!daysParam && !hoursParam) {
        return res.status(400).json({
          error: "InvalidParameters",
          message: "Se debe proporcionar al menos 'days' o 'hours'",
        });
      }

      const days = daysParam ? parseInt(daysParam as string, 10) : 0;
      const hours = hoursParam ? parseInt(hoursParam as string, 10) : 0;

      if ((daysParam && isNaN(days)) || (hoursParam && isNaN(hours)) || days < 0 || hours < 0) {
        return res.status(400).json({
          error: "InvalidParameters",
          message: "Los parámetros 'days' y 'hours' deben ser números enteros positivos",
        });
      }

      const futureDate = await this.service.getFutureBusinessDate(days, hours, dateParam);

      return res.status(200).json({
        date: futureDate.toUTC().toISO({ suppressMilliseconds: true }),
      });
    } catch (err: unknown) {
      console.error(err);
      return res.status(503).json({
        error: "ServiceUnavailable",
        message: "Error al procesar la solicitud",
      });
    }
  }
}





