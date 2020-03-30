const bienvenida = "Hola, voy a guiarle a través de este test sobre el coronavirus (covid19).\n\nSi usted presenta una emergencia contacte con el 112.\n\nEste test no es un sustituto de un consejo, diagnóstico o tratamiento médico profesional. Consulte siempre a un profesional sobre síntomas serios u otro tipo de emergencias. ¿Desea comenzar?"
const pregunta1 = "¿Ha viajado recientemente a alguno de los siguientes países?.España: las Comunidades Autónomas de Madrid y de La Rioja o los municipios de La Bastida y Vitoria (País Vasco). China: todas las provincias, incluyendo Hong Kong y Macao. Italia: todo el país. Francia: departamentos de Haut-Rhin (Grabd Est) y l\'Oise (Hauts-de-France). Alemania: departamento de Heinsberg (Renania del Norte-Westfalia)  Japón: isla de Hokkaidō. Corea del Sur. Singapur o Irán.";
const pregunta2 = "¿Ha estado en contacto con alguien que haya viajado a estos países y que ahora esté enfermo?";
const pregunta3 = "¿Ha estado en contacto con alguien que conozca que esté contagiado de coronavirus (covid19)?";
const pregunta4 = "¿Algún profesional sanitario le ha manifestado que podría haber estado expuesto al coronavirus (covid19)?";
const pregunta5 = "¿Presenta alguno de los siguientes síntomas? ¿Fiebre, Tos, Moqueo nasal o Dolor de garganta?"
const pregunta5_yes = "¿Presenta dificultad respiratoria?";

//const preguntas = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5];
let speech = "";

function postTest(req, res) {

	const intent = req.body.queryResult.intent.displayName;
	console.log(req.body);
		if(intent == "Bienvenida"){
			speech = bienvenida;
		}
		else if(intent == "1pregunta"){
			speech = pregunta1;
		}
		else if(intent == "2pregunta"){
			const recentlyTraveled = req.body.queryResult.parameters.RecentlyTraveled;
			console.log("Recently traveled es = " + recentlyTraveled);
			speech = pregunta2;
		}
		else if(intent == "3pregunta"){
			const sickContact = req.body.queryResult.parameters.SickContact;
			console.log("Sick contact es = " + sickContact);
			speech = pregunta3;
		}
		else if(intent == "4pregunta"){
			const sickCovidContact = req.body.queryResult.parameters.SickCovidContact;
			console.log("Sick covid contact es = " + sickCovidContact);
			speech = pregunta4;
		}
		else if(intent == "5pregunta"){
			const healthOfficial = req.body.queryResult.parameters.HealthOfficial;
			console.log("Health Official es = " + healthOfficial);
			speech = pregunta5;
		}
		else {
			const commonSymptoms = req.body.queryResult.parameters.CommonSymptoms;
			console.log("Common Symptoms es = " + commonSymptoms);
			if(intent == "5pregunta-no"){
				speech = "gracias por su participación";
			}
			else{
				speech = pregunta5_yes;
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
};

module.exports = postTest;