'use strict';
const Alexa = require("alexa-sdk");
const unirest = require("unirest");
const stitch = require("mongodb-stitch");
var request = require('request');
const fetch = require("node-fetch");
const clientPromise = stitch.StitchClientFactory.create('startup-jgarw');



exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'SessionEndedRequest': function () {
    },
    'HelloWorldIntent': function () {
        const intentObj = this.event.request.intent;
        var options = { method: 'GET',
            url: 'https://api.crunchbase.com/v3.1/odm-organizations',
            qs:
                { locations: intentObj.slots.place.value,
                    user_key: '9ff67a4e27113cfbd14cb6fb878168df',
                    sort_order: 'updated_at ASC' } };
        let ne = " ";
        var se = this;
        let hi = JSON;
        clientPromise.then(client => {
            const db = client.service('mongodb', 'mongodb-atlas').db('Startup');
            client.login().then(() =>
                db.collection('Search Data').insertOne({ owner_id: "bcd001", city: intentObj.slots.place.value, 'Time/Date': (new Date).getTime() })
            );
        });

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            hi = JSON.parse(body);
            ne = JSON.stringify(hi.data.items[1].properties.name);
            console.log(ne);
            se.response.speak("Here are the 3 most recently updated startups in " + intentObj.slots.place.value + ". The first is " + JSON.stringify(hi.data.items[1].properties.name)  + ", a company whose description is " + JSON.stringify(hi.data.items[1].properties.short_description) + ". The second is " + JSON.stringify(hi.data.items[2].properties.name)+ ", whose description is " + JSON.stringify(hi.data.items[2].properties.short_description) + "The last is " + JSON.stringify(hi.data.items[3].properties.name)+ ", has the description that " + JSON.stringify(hi.data.items[3].properties.short_description) );
            se.emit(':responseReady');

        });

    },
    'LongIntent': function () {
        const intentObj = this.event.request.intent;
        var options = { method: 'GET',
            url: 'https://api.crunchbase.com/v3.1/odm-organizations',
            qs:
                { locations: intentObj.slots.place.value,
                    user_key: '9ff67a4e27113cfbd14cb6fb878168df',
                    sort_order: 'updated_at ASC' } };
        var se = this;
        let hi = JSON;
        clientPromise.then(client => {
            const db = client.service('mongodb', 'mongodb-atlas').db('Startup');
            client.login().then(() =>
                db.collection('Search Data').insertOne({ owner_id: "bcd001", city: intentObj.slots.place.value, 'Time/Date': (new Date).getTime() })
            );
        });

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            hi = JSON.parse(body);
            se.response.speak("Here are the 3 most recently updated startups in " + intentObj.slots.place.value + ". The first is " + JSON.stringify(hi.data.items[1].properties.name)  + ", a company whose description is " + JSON.stringify(hi.data.items[1].properties.short_description) + ". The second is " + JSON.stringify(hi.data.items[2].properties.name)+ ", whose description is " + JSON.stringify(hi.data.items[2].properties.short_description) + "The last is " + JSON.stringify(hi.data.items[3].properties.name)+ ", has the description that " + JSON.stringify(hi.data.items[3].properties.short_description) );
            se.emit(':responseReady');

        });

    },
    'SayHello': function () {
        const intentObj = this.event.request.intent;
        unirest.get("https://community-angellist.p.mashape.com/search/slugs?query="+intentObj.slots.place.value.replace(/\s+/g, '-').toLowerCase())
            .header("X-Mashape-Key", "UDTtqSTm47mshSHzID2BzqjayOB9p1CdClAjsnBZakKDd9igGr")
            .header("Accept", "application/json")
            .end(function (result) {
                console.log(result.status, result.headers, result.body);
            });




        /* this.response.speak('Hello World!');
         request.post('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/startup-jgarw/service/Fun/incoming_webhook/webhook0',
     { json: { key: 'hi' } },
     function (error, response, body) {
         if (!error && response.statusCode == 200) {
             console.log(body)
         }
     }
 );*/
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the Hello World Sample Skill. ';
        const reprompt = 'Say hello, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    }
};