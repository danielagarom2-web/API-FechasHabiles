import express from "express";
import { DatesController } from "./controllers/datesController";

const app = express();
const controller = new DatesController();

// Endpoint principal
app.get("/business-days", controller.getBusinessDays.bind(controller));

// Redirigir raíz con query hacia /business-days
app.get("/", (req, res) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  return res.redirect(`/business-days${query}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




