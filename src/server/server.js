'use strict';

const express = require("express");
const app = express();
const testRouter = require("../routers/testRouter");
const dbRouter = require("../routers/dbRouter");
const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/test", testRouter);
app.use("/sendToDB", dbRouter);

app.set("port", process.env.PORT || 8000);
const port = app.get("port");

app.listen(port, () => console.log(`Listening on port ${port}!`));