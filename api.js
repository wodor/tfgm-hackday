const http = require('axios');

const getDeparturesData = (stationLocation, response) => {
        let stops = response.data.value.filter((stop) => {
             return (stop.StationLocation === stationLocation);
        });

        let data = stops.reduce((departures, metrolink) => {
            let allowed = 3;

            for(let i = 0; i < allowed; i++) {
                if((metrolink["Dest" + i] !== undefined) && (metrolink["Wait" + i]) !== undefined) {
                    departures.push({
                        'destination': metrolink["Dest"+i],
                        'minutes': metrolink["Wait"+i],
                        'line': metrolink["Line"]
                    });
                }
            }

            return departures;
        }, []);

        data.sort((a, b) => {
            return a.minutes - b.minutes
        });

        let filtered = data.filter((departure, i, self) => {
            if(departure.minutes < 2) {
                return false;
            }

            return i === self.findIndex((t) => {
                return t.minutes === departure.minutes && t.destination === departure.destination
            });
        });

        return filtered.slice(0, 4);
 };

 const formatOutput = (trams) => {
    if(trams.length === 0) {
        return 'No trams found'
    }

    let output = '', tram;

    for(tram in trams) {
        output += `${trams[tram].destination} in ${trams[tram].minutes} minutes, `
    }

    return output
 };

async function callMetrolinkApi(apiKey) {
    try {
        return await http.get(
            'https://api.tfgm.com/odata/Metrolinks',
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": apiKey
                }
            }
        );
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { callMetrolinkApi, getDeparturesData, formatOutput }
