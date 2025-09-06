import express from "express";
import { DatesController } from "./controllers/datesController";

const app = express();
const controller = new DatesController();

app.get("/business-days", controller.getBusinessDays.bind(controller));

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});



