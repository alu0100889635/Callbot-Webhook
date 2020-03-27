const axios = require('axios');

axios({
    method: 'POST',
    url: 'https://api.dialogflow.com/v1/query?v=callbot-271218',
    headers: {
        'Authorization': 'Bearer 1063cfb4d4cd4416b6f510cba3936f1e',
        'Content-Type': 'application/json',
    },
    
    data: {
        "lang": "es",
        "query": "si",
        "sessionId": "12345",
    }
})  
.then((response) => {
    console.log(response.data);
})
.catch((error) => {
    console.log(error);                
})