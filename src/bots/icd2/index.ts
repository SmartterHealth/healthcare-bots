// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { ActivityHandler, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import { CommandHandlerAdapter } from './commands/CommandHandlerAdapter';
import { GetCodeCommandHandler } from './commands/get-code/GetCodeCommandHandler';
import { HelpCommandHandler } from './commands/help/HelpCommandHandler';
import { SearchCodesCommandHandler } from './commands/search-codes/SearchCodesCommandHandler';
import * as appInsights from 'applicationinsights';
import log from './logger';
import settings from './settings';

//import { log } from './logger';
import { WelcomeCommandHandler } from './commands/welcome/WelcomeCommandHandler';
appInsights.setup(settings.appInsights.instrumentationKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();

// Create command adapter instance and register known command handlers.
const botCommandAdapter = new CommandHandlerAdapter([
    SearchCodesCommandHandler,
    GetCodeCommandHandler,
    HelpCommandHandler,
    WelcomeCommandHandler
]);

export default class Icd2Bot extends ActivityHandler {

    private adapter: BotFrameworkAdapter;

    constructor(server: any) {
        
        super();

        this.adapter = new BotFrameworkAdapter({
            appId: settings.bot.MicrosoftAppId,
            appPassword: settings.bot.MicrosoftAppPassword
        });

        server.post('/api/icd2/messages', (req, res) => {
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
            try {
                let commandText = context.activity.text;

               

                // MS Teams sends SubmitActions differently then other chat clients :-/
                if ((!commandText) && context.activity.value && context.activity.value.msteams) {
                    commandText = context.activity.value.msteams.text;
                }

                this.setUserId(context);

                // Execute the command via the command adapter, which will dispatch to the appropriate command handler.
                console.time('botCommandAdapter.execute')
                await botCommandAdapter.execute(context, commandText.trim());
                
            } catch (err) {
                console.log(err);
            } finally {
                // By calling next() you ensure that the next BotHandler is run.
                console.timeEnd('botCommandAdapter.execute')
                await next();
            }
        
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if(membersAdded != null) {
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        log(`User ${context.activity.from.name} added to chat session.`);
                        this.setUserId(context);
                        await botCommandAdapter.execute(context, '');
                    }
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /** Sets the user ID for the current user. */
    private setUserId(context: TurnContext) {
        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.userAuthUserId] = context.activity.from.id;
        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.userAccountId] = context.activity.from.id;
        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.userId] = context.activity.from.name;
    }
}
