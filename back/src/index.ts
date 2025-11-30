import express from "express";
import cors from "cors";
import { router } from "../routes/index.routes.js";

(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://coinmaster.devdiego.work",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use(router);
app.get("/ping", (_req, res) => res.send("pong"));
app.all("*", (_req, res) => {
  res.status(404).json({
    message: "Escribe bien mono estupido",
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Hello world, I am listening on port ${PORT}`);
});
