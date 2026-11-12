import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import { GitHub } from "./config/auth.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";

// create express app
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://client-zkf8.onrender.com",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not configured");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: true, // Local HTTP development only
    },
  }),
);

passport.use(GitHub);

passport.serializeUser((user, done) => {
  const { accesstoken, ...sessionUser } = user;
  done(null, sessionUser);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>',
    );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
