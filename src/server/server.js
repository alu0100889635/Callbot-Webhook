'use strict';
const { exec } = require("child_process");
const axios = require('axios');
const express = require("express");
const app = express();
const testRouter = require("../routers/testRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use(morgan("tiny"));
app.use(cors()); */

app.use("/test", testRouter);

app.set("port", process.env.PORT || 8000);
const port = app.get("port");

app.listen(port, () => console.log(`Listening on port ${port}!`));