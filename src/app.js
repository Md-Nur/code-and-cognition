import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,    
  })
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes importing
import userRoutes from "./routes/user.routes.js";

// Routes mounting
app.use("/api/v1/users", userRoutes);

export { app };
