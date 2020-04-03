const axios = require("axios");
const URL = "http://178.62.41.123:3000";
const questions = require("./questions.json");
let answers = require("./answers.json");
let subject = require("./subject.json");
let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
let numbers = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const sendPhonecallToDB =  async () => {
	console.log("Answers es = ", answers);
	axios.post(URL + "/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}

const sendSubjectToDB = async () => {

	console.log("Subject es = ", subect);
	axios.post(URL + "/subjects/addSubject", subject)
	.then(async response => {
		answers.subject_id = response.data;
		await sendPhonecallToDB();
	})
	.catch(e => console.log(e));
}

const parseBirthDate = (item) => {
	const date = item.split(" ");
	console.log("este es el array", date);
	let month = "";
	for(let i = 0; i < date.length; i++){
		console.log("entra en el primer for");
		for(let j = 0; j < months; j++){
			console.log("entra en el segundo for");
			if(date[i] == months[j]){
				month = numbers[j];
				console.log("mes en el for", month);
			}
		}
	}
	console.log("El año es ", date[date.length-1]);
	console.log("El mes es ", month);
	console.log("El día es ", date[0]);
	let birthDate = date[date.lenght - 1] + '-' + month + '-' + date[0];
	console.log("Nuevo cumple = ", birthDate);
	return birthDate;
}

const cases = async (intent, parameters) => {
	switch(intent){
		case "Bienvenida":
			console.log("entra en bienvenida");
			return questions.bienvenida;
		case "1pregunta":
			return questions.pregunta1;
		case "2pregunta":
			if(parameters.recentlyTraveled == "Sí"){
				answers.recentlyTraveled = true;
			}
			return questions.pregunta2;
		case "3pregunta":
			if(parameters.sickContact == "Sí"){
				answers.sickContact = true;
			}
			return questions.pregunta3;
		case "4pregunta":
			if(parameters.sickCovidContact == "Sí"){
				answers.sickCovidContact = true;
			}
			return questions.pregunta4;
		case "5pregunta":
			if(parameters.healthOfficial == "Sí"){
				answers.healthOfficial = true;
			}
			return questions.pregunta5;
		case "5pregunta - no":
			return questions.pregunta5_no;
		case "5pregunta - yes":
			answers.commonSymptoms = true;
			return questions.pregunta5_yes;
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			answers.difficultyBreathing = true;
			return questions .pregunta6;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			return questions.pregunta5_yes_no;
		case "5pregunta - yes - no - no": //No pertenece a grupo de riesgo
			return questions.pregunta5_yes_no_no;
		case "5pregunta - yes - no - yes": //Sí pertenece a grupo de riesgo
			answers.riskyGroup = true;
			return questions.pregunta6;
		case "6pregunta":
			subject.fullName = parameters.fullName;
			return questions.pregunta7;
		case "7pregunta":
			subject.dni = parameters.dniNumber;
			return questions.pregunta8;
		case "8pregunta":
			console.log("Antiguo cumple = ", parameters.birthDate);
			subject.birthDate= parseBirthDate(parameters.birthDate);
			console.log("Nuevo cumple = ", subject.birthDate);
			return questions.pregunta9;
		case "9pregunta":
			subject.address= parameters.address;
			await sendSubjectToDB();
			return questions.pregunta10;
			
		default:
			console.log(req.body.queryResult);
			break;

	}
}

module.exports.postTest = async function (req, res) {

	let speech = "";

	const intent = req.body.queryResult.intent.displayName;
	const parameters = req.body.queryResult.parameters;
	console.log(req.body.queryResult);
	speech = await cases(intent, parameters);

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
