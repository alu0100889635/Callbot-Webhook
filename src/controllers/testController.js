const axios = require("axios");
const URL = "http://178.62.41.123:3000";
const questions = require("./questions.json");
let answers = require("./answers.json");
let subject = require("./subject.json");
let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
let intentsArray = [];

const sendPhonecallToDB =  async () => {
	console.log("Answers es = ", answers);
	axios.post(URL + "/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}

const sendSubjectToDB = async () => {

	console.log("Subject es = ", subject);
	axios.post(URL + "/subjects/addSubject", subject)
	.then(async response => {
		answers.subject_id = response.data;
		await sendPhonecallToDB();
	})
	.catch(e => console.log(e));
}

/* axios.delete(URL + usuario)
.then(async response => {
	console.log(response)
	await axios.get(URL)//tu get de usuarios
	.then(response => console.log(response))
	.catch(e => console.log(e))
})
.catch(error => console.log(error)) */

const parseBirthDate = (item) => {
	const date = item.split(" ");
	let month = "";
	if(date[0].length = 1){
		date[0] = '0' + date[0];
	}
	for(let i = 0; i < date.length; i++){
		for(let j = 0; j < months.length; j++){
			if(date[i] == months[j]){
				if(j.length = 1){
					month = '0' + (j+1);
				}
				else {
					month = month + (j+1);
				}
			}
		}
	}
	return date[date.length-1] + '-' + month + '-' + date[0];

}


const parseDni = (item) => {
	item = item.replace(/\s+/g, '');
	item = item.toUpperCase();
	console.log("Nuevo dni = ", item);
	return item;
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
			subject.dni = parseDni(parameters.dniNumber);
			return questions.pregunta8;
		case "8pregunta":
			subject.birthDate= parseBirthDate(parameters.birthDate);
			return questions.pregunta9;
		case "9pregunta":
			subject.address= parameters.address;
			await sendSubjectToDB();
			return questions.pregunta10;
		case "1pregunta - fallback":
			return questions.fallback + questions.pregunta1;
		case "2pregunta - fallback":
			return questions.fallback + questions.pregunta2;
		case "3pregunta - fallback":
			return questions.fallback + questions.pregunta3;
		case "4pregunta - fallback":
			return questions.fallback + questions.pregunta4;
		case "5pregunta - fallback":
			return questions.fallback + questions.pregunta5;
		case "5pregunta - no - fallback":
			return questions.fallback + questions.pregunta5_no;
		case "5pregunta - yes - fallback":
			return questions.fallback + questions.pregunta5_yes;
		case "5pregunta - yes - yes - fallback":
			return questions.fallback + questions.pregunta5_yes_yes;
		case "5pregunta - yes - no - fallback":
			return questions.fallback + questions.pregunta5_yes_no;
		case "5pregunta - yes - no - yes - fallback":
			return questions.fallback + questions.pregunta6;
		case "6pregunta - fallback":
			return questions.fallback + questions.pregunta7;
		case "7pregunta - fallback":
			return questions.fallback + questions.pregunta8;
		case "8pregunta - fallback":
			return questions.fallback + questions.pregunta9;
			
		default:
			console.log(intent);
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
	}
	return res.json({
		payload: speechResponse,
		data: speechResponse,
		fulfillmentText: speech,
		speech: speech,
		displayText: speech,
		source: "webhook-echo-sample"
	});	

}
