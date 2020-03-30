const questions = require("./questions.json");

module.exports.postTest = function (req, res) {

	let answers = {
		recentlyTraveled: "",
		sickContact: "",
		sickCovidContact: "",
		healthOfficial: ""
	}
	let speech = "";
	const intent = req.body.queryResult.intent.displayName;
	const parameters = req.body.queryResult.parameters;
	console.log(req.body);

	switch(intent){
		case "Bienvenida":
			speech = questions.bienvenida;
			break;
		case "1pregunta":
			speech = questions.pregunta1;
			break;
		case "2pregunta":
			respuestas.recentlyTraveled = parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + recentlyTraveled);
			speech = questions.pregunta2;
			break;
		case "3pregunta":
			respuestas.sickContact = parameters.SickContact;
			console.log("Sick contact es = " + sickContact);
			speech = questions.pregunta3;
			break;
		case "4pregunta":
			respuestas.sickCovidContact = parameters.SickCovidContact;
			console.log("Sick covid contact es = " + sickCovidContact);
			speech = questions.pregunta4;
			break;
		case "5pregunta":
			respuestas.healthOfficial = parameters.HealthOfficial;
			console.log("Health official es = " + healthOfficial);
			speech = questions.pregunta5;
			break;
	}
		/* if(intent == "Bienvenida"){
			speech = questions.bienvenida;
		}
		else if(intent == "1pregunta"){
			speech = questions.pregunta1;
		}
		else if(intent == "2pregunta"){
			const recentlyTraveled = parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + recentlyTraveled);
			speech = questions.pregunta2;
		}
		else if(intent == "3pregunta"){
			const sickContact = parameters.SickContact;
			console.log("Sick contact es = " + sickContact);
			speech = questions.pregunta3;
		}
		else if(intent == "4pregunta"){
			const sickCovidContact = parameters.SickCovidContact;
			console.log("Sick covid contact es = " + sickCovidContact);
			speech = questions.pregunta4;
		}
		else if(intent == "5pregunta"){
			const healthOfficial = parameters.HealthOfficial;
			console.log("Health Official es = " + healthOfficial);
			speech = questions.pregunta5;
		}
		else {
			const commonSymptoms = parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + commonSymptoms);
			if(intent == "5pregunta-no"){
				speech = "gracias por su participación";
			}
			else{
				speech = questions.pregunta5_yes;
			}
		} */
	const speechResponse = {
		google: {
			expectUserResponse: true,
			richResponse: {
				items: [
				{
					simpleResponse: {
					textToSpeech: speech
					}
				}
				]
			}
		}
	};
  
	return res.json({
		payload: speechResponse,
		data: speechResponse,
		fulfillmentText: speech,
		speech: speech,
		displayText: speech,
		source: "webhook-echo-sample"
	});
}
