const questions = require("./questions.json");

const cases = (intent, parameters) => {
	let answers = {
		recentlyTraveled: "",
		sickContact: "",
		sickCovidContact: "",
		healthOfficial: "",
		commonSymptoms: "",
		difficultyBreathing: ""
	}
	switch(intent){
		case "Bienvenida":
			return questions.bienvenida;
		case "1pregunta":
			return questions.pregunta1;
		case "2pregunta":
			answers.recentlyTraveled = parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + answers.recentlyTraveled);
			return questions.pregunta2;
		case "3pregunta":
			answers.sickContact = parameters.SickContact;
			console.log("Sick contact es = " + answers.sickContact);
			return questions.pregunta3;
		case "4pregunta":
			answers.sickCovidContact = parameters.SickCovidContact;
			console.log("Sick covid contact es = " + answers.sickCovidContact);
			return questions.pregunta4;
		case "5pregunta":
			answers.healthOfficial = parameters.HealthOfficial;
			console.log("Health official es = " + answers.healthOfficial);
			return questions.pregunta5;
		case "5pregunta - no":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + answers.commonSymptoms);
			return questions.pregunta5_no;
		case "5pregunta - yes":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + answers.commonSymptoms);
			return questions.pregunta5_yes;
			console.log(speech);
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Difficulty Breathing es = " + answers.difficultyBreathing);
			return questions .pregunta5_yes_yes;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Difficulty Breathing es = " + answers.difficultyBreathing);
			return questions.pregunta5_yes_no;
		case "5pregunta - yes - no - no":
			answers.riskyGroup = parameters.RiskyGroup; 
			console.log("Risky Group es = " + answers.riskyGroup);
			return questions.pregunta5_yes_no_no;
		case "5pregunta - yes - no - yes":
			answers.riskyGroup = parameters.RiskyGroup;
			console.log("Risky Group es = " + answers.riskyGroup);
			return questions.pregunta5_yes_no_yes;
		default:
			console.log(req.body.queryResult);
			break;

	}
}
module.exports.postTest = function (req, res) {

	/* let answers = {
		recentlyTraveled: "",
		sickContact: "",
		sickCovidContact: "",
		healthOfficial: "",
		commonSymptoms: "",
		difficultyBreathing: ""
	} */
	let speech = "";

	const intent = req.body.queryResult.intent.displayName;
	const parameters = req.body.queryResult.parameters;
	console.log(req.body.queryResult);

	speech = cases(intent, parameters);
	console.log("Speech es = ", speech);
	/* switch(intent){
		case "Bienvenida":
			speech = questions.bienvenida;
			break;
		case "1pregunta":
			speech = questions.pregunta1;
			break;
		case "2pregunta":
			answers.recentlyTraveled = parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + answers.recentlyTraveled);
			speech = questions.pregunta2;
			break;
		case "3pregunta":
			answers.sickContact = parameters.SickContact;
			console.log("Sick contact es = " + answers.sickContact);
			speech = questions.pregunta3;
			break;
		case "4pregunta":
			answers.sickCovidContact = parameters.SickCovidContact;
			console.log("Sick covid contact es = " + answers.sickCovidContact);
			speech = questions.pregunta4;
			break;
		case "5pregunta":
			answers.healthOfficial = parameters.HealthOfficial;
			console.log("Health official es = " + answers.healthOfficial);
			speech = questions.pregunta5;
			break;
		case "5pregunta - no":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + answers.commonSymptoms);
			speech = questions.pregunta5_no;
			break;
		case "5pregunta - yes":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + answers.commonSymptoms);
			speech = questions.pregunta5_yes;
			console.log(speech);
			break;
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Difficulty Breathing es = " + answers.difficultyBreathing);
			speech = questions .pregunta5_yes_yes;
			break;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Difficulty Breathing es = " + answers.difficultyBreathing);
			speech = questions.pregunta5_yes_no;
			break;
		case "5pregunta - yes - no - no":
			answers.riskyGroup = parameters.RiskyGroup; 
			console.log("Risky Group es = " + answers.riskyGroup);
			speech = questions.pregunta5_yes_no_no;
			break;
		case "5pregunta - yes - no - yes":
			answers.riskyGroup = parameters.RiskyGroup;
			console.log("Risky Group es = " + answers.riskyGroup);
			speech = questions.pregunta5_yes_no_yes;
			break;
		default:
			console.log(req.body.queryResult);
			break;

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
