
import * as restify from 'restify';
import Icd2Bot from './bots/icd2';
import BenefitsBot from './bots/benefits';
import settings from './settings';

// Create HTTP server. 
const server = restify.createServer();
server.name = 'SmartterHealth Bot Server';
server.listen(settings.bots.port, () => {
    console.log(`${server.name} is listening on ${settings.bots.port}.`);
    initializeBots();
}); 

const initializeBots = () => {
    // Create bot, and set route
    const icd2 = new Icd2Bot(server);
    console.log('\t* ICD2 bot is up and running!')  

    // Create bot, and set route
    const benefits = new BenefitsBot(server);
    console.log('\t* Benefits bot is up and running!')
}
