const questions = require("./questions.json");
const axios = require("axios");
const URL = "http://localhost:3000";

let answers = {
	recentlyTraveled: false,
	sickContact: false,
	sickCovidContact: false,
	healthOfficial: false,
	commonSymptoms: false,
	difficultyBreathing: false,
	riskyGroup: false,
	subject_id: "",
	observations: []
}

let subject = {
	fullName: "",
	dni: "",
	birthDate: "",
	address: ""
}

const sendPhonecallToDB =  async () => {

	axios.post("http://[::1]:3000/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}

const sendSubejectToDB = async () => {

	axios.post("http://[::1]:3000/subjects/addSubject", subject)
	.then(response => {
		console.log(response);
		answers.subject_id = response;
	})
	.catch(e => console.log(e));
}

const sendDataToDB = async () => {
	
	await sendSubejectToDB();
	await sendPhonecallToDB();
}

const cases = (intent, parameters) => {

	switch(intent){
		case "Bienvenida":
			return questions.bienvenida;
		case "1pregunta":
			return questions.pregunta1;
		case "2pregunta":
			if(parameters.RecentlyTraveled == "Sí"){
				answers.recentlyTraveled = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta2;
		case "3pregunta":
			if(parameters.SickContact == "Sí"){
				answers.sickContact = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta3;
		case "4pregunta":
			if(parameters.SickCovidContact == "Sí"){
				answers.sickCovidContact = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta4;
		case "5pregunta":
			if(parameters.HealthOfficial == "Sí"){
				answers.healthOfficial = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5;
		case "5pregunta - no":
			if(parameters.CommonSymptoms == "Sí"){
				answers.commonSymptoms = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5_no;
		case "5pregunta - yes":
			if(parameters.CommonSymptoms == "Sí"){
				answers.commonSymptoms = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes;
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			if(parameters.DifficultyBreathing == "Sí"){
				answers.difficultyBreathing = true;
			}
			console.log("Answers es = ", answers);
			return questions .pregunta6;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			if(parameters.DifficultyBreathing == "Sí"){
				answers.difficultyBreathing = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes_no;
		case "5pregunta - yes - no - no": //No pertenece a grupo de riesgo
			if(parameters.RiskyGroup == "Sí"){
				answers.riskyGroup = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes_no_no;
		case "5pregunta - yes - no - yes": //Sí pertenece a grupo de riesgo
			if(parameters.RiskyGroup == "Sí"){
				answers.riskyGroup = true;
			}
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
			const enviar = async () =>{
				await sendDataToDB();
			}
			enviar();
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
