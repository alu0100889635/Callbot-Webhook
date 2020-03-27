const axios = require('axios');
const evento = "WELCOME";
axios({
    method: 'GET',
    url: 'https://api.dialogflow.com/v1/query?v=callbot-271218&e=WELCOME&sessionId=12345&lang=es',
    //url: 'https://api.dialogflow.com/v1/query?v=callbot-271218&query=si&sessionId=12345&lang=es',
    headers: {
        'Authorization': 'Bearer 1063cfb4d4cd4416b6f510cba3936f1e',
        'Content-Type': 'application/json'
    }
})  
.then((response) => {
    console.log(response.data);
})
.catch((error) => {
    console.log(error);                
})