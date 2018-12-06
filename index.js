const api = require ('./api.js')

exports.handler = async (event) => {

    let result = await api.callMetrolinkApi('6d674edb6dc3405fb72a0d21f9de9680')
    .then(response => api.getDeparturesData("Market Street", response))
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};
