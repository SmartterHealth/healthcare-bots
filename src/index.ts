
import * as restify from 'restify';
import Icd2Bot from './bots/icd2';
import BenefitsBot from './bots/benefits';
import settings from './settings';

// Create HTTP server. 
const server = restify.createServer();
server.name = 'SmartterHealth Bot Server';
server.listen(settings.bots.port, () => {
    console.log(`${server.name} is listening on ${settings.bots.port}.`);

    if(process.env.NODE_ENV === 'DEVELOPMENT') { 
        console.warn('Warning: NODE_ENV is DEVELOPMENT.');
    }

    // Fire the bots up!
    initializeBots();

    console.log('Hit CTRL+C to quit.');
}); 

/**
 * Initializes the bot class instances.
 */
const initializeBots = () => {

    try {
        const icd2 = new Icd2Bot(server);
        console.log('\t* ICD2 bot is up and running!');
    } catch (err) {
        console.error(`ERROR: Could not start Icd2Bot: ${err}\n`)
    }

    try {
        const benefits = new BenefitsBot(server);
        console.log('\t* Benefits bot is up and running!');
    } catch (err) {
        console.error(`ERROR: Could not start BenefitsBot: ${err}`)
    }
}
