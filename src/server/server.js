'use strict';
const { exec } = require("child_process");
const axios = require('axios');
const express = require("express");
const app = express();
const answersRouter = require("../routers/answersRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use(morgan("tiny"));
app.use(cors()); */

//app.use("/answers", answersRouter);

app.post("/questions", function(req, res) {
	exec(req >> req.json, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	})
	req >> req.json;
	const pregunta1 = "";
	if(speech == "Hola") {
		pregunta1 = "Hola, voy a guiarle a través de este test sobre el coronavirus (covid19).Si usted presenta una emergencia contacte con el 112.Este test no es un sustituto de un consejo, diagnóstico o tratamiento médico profesional. Consulte siempre a un profesional sobre síntomas serios u otro tipo de emergencias. ¿Desea comenzar?";
	}
	else{
		pregunta1 = "No te pillo wey";
	}
	const speechResponse = {
		google: {
			expectUserResponse: true,
			richResponse: {
				items: [
				{
					simpleResponse: {
					textToSpeech: pregunta1
					}
				}
				]
			}
		}
	};
  
	return res.json({
		payload: speechResponse,
		data: speechResponse,
		fulfillmentText: pregunta1,
		speech: pregunta1,
		displayText: pregunta1,
		source: "webhook-echo-sample"
	});
});

/* app.get("/answers", function(req, res) {
    const speech = req.body.queryResult;
	console.log(speech);

	const speech2 = "Hola, voy a guiarle a través de este test sobre el coronavirus (covid19).\n\nSi usted presenta una emergencia contacte con el 112.\n\nEste test no es un sustituto de un consejo, diagnóstico o tratamiento médico profesional. Consulte siempre a un profesional sobre síntomas serios u otro tipo de emergencias. ¿Desea comenzar?";
  
	const speechResponse = {
		google: {
		expectUserResponse: true,
		richResponse: {
			items: [
			{
				simpleResponse: {
				textToSpeech: speech2
				}
			}
			]
		}
		}
	};
  
	return res.json({
		payload: speechResponse,
		//data: speechResponse,
		fulfillmentText: speech2,
		speech: speech2,
		displayText: speech2,
		source: "webhook-echo-sample"
	});
}); */
/* mongoose
.connect("mongodb://localhost:27017/emergenciasdb", { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log("DB connection was succesful"))
.catch(err => console.log(err)); */

app.set("port", process.env.PORT || 8000);
const port = app.get("port");

app.listen(port, () => console.log(`Listening on port ${port}!`));