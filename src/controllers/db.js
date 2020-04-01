const axios = require("axios");
let answers = require("./answers.json");
let subject = require("./subject.json");
const URL = "http://localhost:3000";


/* async function sendPhonecallToDB(){
	console.log("estamos dentro de sendPhonecalltodb");
	axios.post("http://[::1]:3000/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));

} */

const sendPhonecallToDB =  async () => {

	axios.post(URL + "/phonecalls/addPhonecall", answers)
	.then(response => console.log(response))
	.catch(e => console.log(e));
}
//comentario
/* async function sendSubjectToDB(){
	console.log("estamos dentro de sendSUbjectToDB");
	axios.post("http://[::1]:3000/subjects/addSubject", subject)
	.then(response => {
		console.log(response);
		answers.subject_id = response;
	})
	.catch(e => console.log(e));

} */

const sendSubjectToDB = async () => {

	axios.post(URL + "/subjects/addSubject", subject)
	.then(response => {
		console.log(response);
		answers.subject_id = response;
	})
	.catch(e => console.log(e));
}

const sendDataToDB = async () => {

	console.log("entra en sendDataDB");
	
	let respuesta1 = await sendSubjectToDB();
	console.log("respuesta sujeto = ", respuesta1);
	let respuesta2 = await sendPhonecallToDB();
	console.log("respuesta llamada = ", respuesta2);
}
const sendToDB = async () => {
	if(finished){
		let resultado = await sendDataToDB();
		console.log("Resultado de sendtodatabase", resultado);
	}
	else{
		console.log("Aún no ha terminado la encuesta");
	}
}