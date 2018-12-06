api = require('./api.js');

api.callMetrolinkApi('6d674edb6dc3405fb72a0d21f9de9680')
    .then(response => api.getDeparturesData("Market Street", response))
    .then(result => console.log(api.formatOutput(result)))