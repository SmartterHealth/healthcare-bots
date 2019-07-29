import * as dotenv from 'dotenv';

dotenv.config();

/**
 * IMPORTANT: Ensure that bot settings have unique prefix!
 */
const settings = {
    bot: {
        /** The ID of the bot registered in Azure. */
        MicrosoftAppId: process.env['benefits.MicrosoftAppId'],
        /** The password/secret of the bot registered in Azure. */
        MicrosoftAppPassword: process.env['benefits.MicrosoftAppPassword'],
        /** The ID of the QnA Maker Knowledge Base registered in Azure. You can get this value from https://www.qnamaker.ai/Home/MyServices */
        QnAKnowledgebaseId: process.env['benefits.QnAKnowledgebaseId'],
        /** The password/secret needed to connect to your QnA Maker Knowledge Base. You can get this in the Azure Portal. */
        QnAEndpointKey: process.env['benefits.QnAEndpointKey'],
        /** The host name of the QnA Maker Knowledge Base registered in Azure. You can get this value from https://www.qnamaker.ai/Home/MyServices */
        QnAEndpointHostName: process.env['benefits.QnAEndpointHostName']
    }
}

if(process.env.NODE_ENV === 'DEVELOPMENT') {
    console.log('BenefitsBot Settings:', settings)
}

export default settings;