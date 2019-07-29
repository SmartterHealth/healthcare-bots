import * as dotenv from 'dotenv';

dotenv.config();

const settings = {
    bot: {
        MicrosoftAppId: process.env['benefits.MicrosoftAppId'],
        MicrosoftAppPassword: process.env['benefits.MicrosoftAppPassword'],
        QnAKnowledgebaseId: process.env['benefits.QnAKnowledgebaseId'],
        QnAEndpointKey: process.env['benefits.QnAEndpointKey'],
        QnAEndpointHostName: process.env['benefits.QnAEndpointHostName']
    }
}

//console.table(settings)

export default settings;