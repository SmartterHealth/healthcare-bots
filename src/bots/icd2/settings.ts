import * as dotenv from 'dotenv';

dotenv.config();

/**
 * IMPORTANT: Ensure that bot settings have unique prefix!
 */
const settings = {
    bot: {
        /** The ID of the bot registered in Azure. */
        MicrosoftAppId: process.env['icd2.MicrosoftAppId'],
        /** The password/secret of the bot registered in Azure. */
        MicrosoftAppPassword: process.env['icd2.MicrosoftAppPassword']
    }
}

if(process.env.NODE_ENV === 'DEVELOPMENT') {
    console.log('Icd2Bot Settings:', settings)
}

export default settings;