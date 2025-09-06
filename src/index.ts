import express from "express";
import { DatesController } from "./controllers/datesController";

const app = express();
const controller = new DatesController();


app.get("/business-days", controller.getBusinessDays.bind(controller));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



