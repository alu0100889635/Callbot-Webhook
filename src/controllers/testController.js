const questions = require("./questions.json");
module.exports.postTest = function (req, res) {


	
	let speech = "";
	const intent = req.body.queryResult.intent.displayName;
	console.log(req.body);
		if(intent == "Bienvenida"){
			speech = questions.bienvenida;
		}
		else if(intent == "1pregunta"){
			speech = questions.pregunta1;
		}
		else if(intent == "2pregunta"){
			const recentlyTraveled = req.body.queryResult.parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + recentlyTraveled);
			speech = questions.pregunta2;
		}
		else if(intent == "3pregunta"){
			const sickContact = req.body.queryResult.parameters.SickContact;
			console.log("Sick contact es = " + sickContact);
			speech = questions.pregunta3;
		}
		else if(intent == "4pregunta"){
			const sickCovidContact = req.body.queryResult.parameters.SickCovidContact;
			console.log("Sick covid contact es = " + sickCovidContact);
			speech = questions.pregunta4;
		}
		else if(intent == "5pregunta"){
			const healthOfficial = req.body.queryResult.parameters.HealthOfficial;
			console.log("Health Official es = " + healthOfficial);
			speech = questions.pregunta5;
		}
		else {
			const commonSymptoms = req.body.queryResult.parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + commonSymptoms);
			if(intent == "5pregunta-no"){
				speech = "gracias por su participación";
			}
			else{
				speech = questions.pregunta5_yes;
			}
		}
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
