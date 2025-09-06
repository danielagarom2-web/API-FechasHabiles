import { Request, Response } from "express";
import { DatesService } from "../services/datesService";

export class DatesController {
  private readonly service: DatesService;

  constructor() {
    this.service = new DatesService();
  }

  public async getBusinessDays(req: Request, res: Response): Promise<Response> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 0;
      const hours = req.query.hours ? parseInt(req.query.hours as string, 10) : 0;
      const date = req.query.date as string | undefined;

      const futureDate = await this.service.getFutureBusinessDate(days, hours, date);

      return res.status(200).json({
        date: futureDate.toUTC().toISO({ suppressMilliseconds: true }),
      });
    } catch (err) {
      console.error(err);
      return res.status(503).json({
        error: "ServiceUnavailable",
        message: "Error al procesar la solicitud",
      });
    }
  }
}



