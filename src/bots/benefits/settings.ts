import * as dotenv from 'dotenv';

dotenv.config();

const settings = {
    bot: {
        MicrosoftAppId: process.env['benefits.MicrosoftAppId'],
        MicrosoftAppPassword: process.env['benefits.MicrosoftAppPassword']
    }
}

export default settings;