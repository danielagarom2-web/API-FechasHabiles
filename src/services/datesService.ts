import { calculateFutureDate } from "../utils/times";
import { DateTime } from "luxon";

export class DatesService {
  public async getFutureBusinessDate(
    days: number,
    hours: number,
    date?: string
  ): Promise<DateTime> {
    return await calculateFutureDate(days, hours, date);
  }
}