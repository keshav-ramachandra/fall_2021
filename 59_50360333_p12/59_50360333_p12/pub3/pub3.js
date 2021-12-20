const axios = require('axios')

const io = require("socket.io-client");

const socket = io.connect("ws://socket-server:7000");

// An api key is emailed to you when you sign up to a plan
const api_key = '6ed28ebdc2e78847dc85acb358c911c5'




function advertise(topic){
    socket.emit("advertise", "pub3",topic)
}

advertise("eu");


function publish(topic, event){
    socket.emit("pub3", topic, event);
}

let sport_key = 'upcoming'

axios.get('https://api.the-odds-api.com/v3/odds', {
    params: {
        api_key: api_key,
        sport: sport_key,
        region: 'eu', // uk | us | eu | au
        mkt: 'h2h' // h2h | spreads | totals
    }
}).then(response => {
    // odds_json['data'] contains a list of live and 
    //   upcoming events and odds for different bookmakers.
    // Events are ordered by start time (live events are first)
    console.log(
        `Successfully got ${response.data.data.length} events`,
        `Here's the first event:`
    )

    let matches = response.data.data
    
    let match_count = response.data.data.length;
    let count = -1;
   
    
 
       //let sock = socket;
        setInterval(function () {
            if(count < match_count){     
               count = count + 1;

               try{
                    let total_sites = matches[count].sites_count
                    const rndInt = Math.floor(Math.random() * total_sites);
                    console.log("site count is", rndInt);
                    if(rndInt !== 'undefined' && rndInt < total_sites && total_sites > 0){
                       console.log(matches[count].sites[rndInt].site_nice, matches[count].teams[0], matches[count].teams[1], matches[count].sites[rndInt].odds['h2h'][0], matches[count].sites[rndInt].odds['h2h'][1] );
                       publish("eu", { "bookmaker": matches[count].sites[rndInt].site_nice,"team1" : matches[count].teams[0], "team2" :matches[count].teams[1],  "odds1" : matches[count].sites[rndInt].odds['h2h'][0], "odds2" : matches[count].sites[rndInt].odds['h2h'][1] });
                    }
                }
                catch(e){
                    console.log(e)
                }
            }
        }, 20000);    

    
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])

})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})
