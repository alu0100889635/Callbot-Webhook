const axios = require("axios");
const URL = "http://178.62.41.123:3000";
const questions = require("./questions.json");
let answers = require("./answers.json");
let subject = require("./subject.json");

let persona = {
	"fullName": "Miriam Cruz Torres",
	"dni": "77777777K",
	"birthDate": "1994-01-01",
	"address": "Calle calle número 3 3800 Tenerife"
};

let llamada = {
	"recentlyTraveled": false,
	"sickContact": false,
	"sickCovidContact": true,
	"healthOfficial": true,
	"commonSymptoms": true,
	"difficultyBreathing": true,
	"riskyGroup": false,
	"subject_id": "",
	"observations": []
};

let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

const addNewPhone = async () => {
	axios.post(URL + "/phonecalls/addPhonecall", llamada)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}
const addNew = async () => {
	axios.post(URL + "/subjects/addSubject", persona)
	.then(async response => {
		llamada.subject_id = response.data;
		await addNewPhone();
	})
	.catch(e => console.log(e));
}
const sendPhonecallToDB =  async () => {
	axios.post(URL + "/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));

	answers = {
		"recentlyTraveled": false,
		"sickContact": false,
		"sickCovidContact": false,
		"healthOfficial": false,
		"commonSymptoms": false,
		"difficultyBreathing": false,
		"riskyGroup": false,
		"subject_id": "",
		"observations": []
	};

	subject = {
		"fullName": "",
		"dni": "",
		"birthDate": "",
		"address": ""
	};
	await addNew();
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
			console.log("Answers es = ", answers);
			return questions.pregunta2;
		case "3pregunta":
			if(parameters.sickContact == "Sí"){
				answers.sickContact = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta3;
		case "4pregunta":
			if(parameters.sickCovidContact == "Sí"){
				answers.sickCovidContact = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta4;
		case "5pregunta":
			if(parameters.healthOfficial == "Sí"){
				answers.healthOfficial = true;
			}
			console.log("Answers es = ", answers);
			return questions.pregunta5;
		case "5pregunta - no":
			let frase;
			let verdad = false;
			for(let i = 0; i<Object.values(answers).length; i++){
				console.log(Object.values(answers)[i]);
				if(Object.values(answers)[i] === true){
					verdad = true;
				};
			};
			if(!verdad){
				frase = questions.pregunta5_no;
			} 
			else{
				frase = questions.pregunta5_some;
			}
			return frase;
		case "5pregunta - yes":
			answers.commonSymptoms = true;
			console.log("Answers es = ", answers);
			return questions.pregunta5_yes;
		case "5pregunta - yes - yes": //sí tiene dificultad respiratoria
			answers.difficultyBreathing = true;
			console.log("Answers es = ", answers);
			return questions .pregunta6;
		case "5pregunta - yes - no": //no tiene dificultad respiratoria
			return questions.pregunta5_yes_no;
		case "5pregunta - yes - no - no": //No pertenece a grupo de riesgo
			return questions.pregunta5_yes_no_no;
		case "5pregunta - yes - no - yes": //Sí pertenece a grupo de riesgo
			answers.riskyGroup = true;
			console.log("Answers es = ", answers);
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
