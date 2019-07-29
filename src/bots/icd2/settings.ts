import * as dotenv from 'dotenv';

dotenv.config();

const settings = {
    bot: {
        MicrosoftAppId: process.env['icd2.MicrosoftAppId'],
        MicrosoftAppPassword: process.env['icd2.MicrosoftAppPassword']
    }
}

export default settings;