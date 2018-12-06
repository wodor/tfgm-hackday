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

callMetrolinkApi('6d674edb6dc3405fb72a0d21f9de9680')
    .then(response => getDeparturesData("Market Street", response))
    .then(result => console.log(result));
