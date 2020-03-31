const questions = require("./questions.json");
const axios = require("axios");
const URL = "http://localhost:3000";

let answers = {
	recentlyTraveled: "",
	sickContact: "",
	sickCovidContact: "",
	healthOfficial: "",
	commonSymptoms: "",
	difficultyBreathing: "",
	riskyGroup: "",
	subject_id: ""
}

let subject = {
	fullName: "",
	dni: "",
	birthDate: "",
	address: ""
}

const sendToDB = async () => {
	await axios.post(URL + "/subjects", subject)
	.then(response => {
		console.log(response);
		answers.subject_id = response;
	})
	.catch(e => console.log(e));

	await axios.post(URL + "/phonecalls", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}

const cases = (intent, parameters) => {

	switch(intent){
		case "Bienvenida":
			return questions.bienvenida;
		case "1pregunta":
			return questions.pregunta1;
		case "2pregunta":
			answers.recentlyTraveled = parameters.RecentlyTraveled;
			console.log("Answers es = ", answers);
			return questions.pregunta2;
		case "3pregunta":
			answers.sickContact = parameters.SickContact;
			console.log("Answers es = ", answers);
			return questions.pregunta3;
		case "4pregunta":
			answers.sickCovidContact = parameters.SickCovidContact;
			console.log("Answers es = ", answers);
			return questions.pregunta4;
		case "5pregunta":
			answers.healthOfficial = parameters.HealthOfficial;
			console.log("Answers es = ", answers);
			return questions.pregunta5;
		case "5pregunta - no":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Answers es = ", answers);
			return questions.pregunta5_no;
		case "5pregunta - yes":
			answers.commonSymptoms = parameters.CommonSymptoms;
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes;
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Answers es = ", answers);
			return questions .pregunta6;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			answers.difficultyBreathing = parameters.DifficultyBreathing;
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes_no;
		case "5pregunta - yes - no - no": //No pertenece a grupo de riesgo
			answers.riskyGroup = parameters.RiskyGroup; 
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes_no_no;
		case "5pregunta - yes - no - yes": //Sí pertenece a grupo de riesgo
			answers.riskyGroup = parameters.RiskyGroup;
			console.log("Answers es = ", answers);
			return questions.pregunta6;
		case "6pregunta":
			subject.fullName = parameters.FullName;
			console.log("Subject es = ", subject);
			return questions.pregunta7;
		case "7pregunta":
			subject.dni = parameters.DniNumber;
			console.log("Subject es = ", subject);
			return questions.pregunta8;
		case "8pregunta":
			subject.birthDate= parameters.BirthDate;
			console.log("Subject es = ", subject);
			return questions.pregunta9;
		case "9pregunta":
			subject.address= parameters.Address;
			console.log("Subject es = ", subject);
			sendToDB();
			return questions.pregunta10;
			
		default:
			console.log(req.body.queryResult);
			break;

	}
}
module.exports.postTest = function (req, res) {

	let speech = "";

	const intent = req.body.queryResult.intent.displayName;
	const parameters = req.body.queryResult.parameters;
	console.log(req.body.queryResult);
	speech = cases(intent, parameters);
	console.log("Speech es = ", speech);

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
