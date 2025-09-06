import fetch from "node-fetch";
import { HOLIDAYS_URL } from "../src/config/config";

async function test() {
  try {
    const res = await fetch(HOLIDAYS_URL);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error fetching holidays:", err);
  }
}

test();