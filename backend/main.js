import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import syncDatabase from "./models/database/sync-database.js";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env["PORT"] || 3000;

syncDatabase();

app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(cors());

app.use("/chat", chatRoutes);

app.use(express.static(path.join(__dirname, "./build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "./build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
