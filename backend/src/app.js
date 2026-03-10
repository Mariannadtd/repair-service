const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const requestsRouter = require("./routes/requests");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/users", usersRouter);
app.use(requestsRouter);

module.exports = app;
