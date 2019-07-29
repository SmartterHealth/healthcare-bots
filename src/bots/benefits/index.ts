// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { ActivityHandler, BotFrameworkAdapter } from 'botbuilder';
import settings from './settings';

export default class BenefitsBot extends ActivityHandler {

    private adapter: BotFrameworkAdapter;

    constructor(server: any) {
        
        super();

        this.adapter = new BotFrameworkAdapter({
            appId: settings.bot.MicrosoftAppId,
            appPassword: settings.bot.MicrosoftAppPassword
        });

        server.post('/api/benefits/messages', (req, res) => {
            this.adapter.processActivity(req, res, async (context) => {
                // Route to main dialog.
                await this.run(context);
            });
        });

        // Catch-all for errors.
        this.adapter.onTurnError = async (context, error) => {
            // This check writes out errors to console log .vs. app insights.
            console.error(`\n [onTurnError]: ${ error }`);
            // Send a message to the user
            await context.sendActivity(`Oops. Something went wrong!`);
        };

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            await context.sendActivity(`Benefits: You said '${ context.activity.text }'`);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if(membersAdded != null) {
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        await context.sendActivity('Benefits: Hello and welcome!');
                    }
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
