// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { ActivityHandler, BotFrameworkAdapter, TurnContext } from "botbuilder";
import settings from "./settings";
const { QnAMaker } = require("botbuilder-ai");

export default class BenefitsBot extends ActivityHandler {

    /** Reference to a BotFrameworkAdapter instance. */
    private adapter: BotFrameworkAdapter;
    
    /** Reference to a QnAMaker instance. */
	private qnaMaker: any;

    /**
     * Initializes the BenefitsBot instance.
     * @param server The HTTP server instance that is hosting the bot.
     */
	constructor(server: any) {
		super();

		this.initAdapter(server);
		this.initQnAMaker();

        // Setup event handlers for the bot.
		this.onMessage((context, next) => this.handleOnMessage(context, next));
		this.onMembersAdded((context, next) => this.handleOnMembersAdded(context, next));
	}

    /**
     * Initialize the QNA maker instance.
     */
	private initQnAMaker() {
		
        this.qnaMaker = new QnAMaker({
            knowledgeBaseId: settings.bot.QnAKnowledgebaseId,
            endpointKey: settings.bot.QnAEndpointKey,
            host: settings.bot.QnAEndpointHostName,
        });
	}

    /**
     * Initialize the bot adapter instance.
     * @param server The HTTP server instance that is hosting the bot.
     */
	private initAdapter(server: any) {
		this.adapter = new BotFrameworkAdapter({
			appId: settings.bot.MicrosoftAppId,
			appPassword: settings.bot.MicrosoftAppPassword,
        });
        
		server.post("/api/benefits/messages", (req, res) => {
			this.adapter.processActivity(req, res, async context => {
				// Route to main dialog.
				await this.run(context);
			});
        });
        
		// Catch-all for errors.
		this.adapter.onTurnError = async (context, error) => this.handleError(context, error);
	}

    /**
     * Handles an error that occurs during the bot conversation.
     * @param context Context object containing information cached for a single turn of conversation with a user.
     * @param error The error that occured during the bot conversation.
     */
    private async handleError(context: TurnContext, error: Error): Promise<void> {
        // This check writes out errors to console log .vs. app insights.
			console.error(`\n [onTurnError]: ${(error)}. ${error.stack}`);
            
            if(process.env.NODE_ENV === 'DEVELOPMENT') {
                await context.sendActivity(`Apologies, but Something went wrong. Please contact your system administrator.`);
            } else {
                await context.sendActivity(`Apologies, but Something went wrong. Please contact your system administrator.`);
            }
    }

    /**
     * Handles whenever a new user is connected to the bot.
     * @param context Context object containing information cached for a single turn of conversation with a user.
     * @param next Callback Promise that lets the adapter know we are finished processing the user being added.
     */
	private async handleOnMembersAdded(context: TurnContext, next: () => Promise<void>): Promise<any> {
		const membersAdded = context.activity.membersAdded;
		if (membersAdded != null) {
			for (const member of membersAdded) {
				if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity("Benefits Bot: Hello and welcome!");
                    console.log(this.qnaMaker)
				}
			}
		}
		// By calling next() you ensure that the next BotHandler is run.
		await next();
	}

    /**
     * Handles incoming messages from users to the bot.
     * @param context Context object containing information cached for a single turn of conversation with a user.
     * @param next Callback Promise that lets the adapter know we are finished processing the message.
     */
	private async handleOnMessage(context: TurnContext, next: () => Promise<void>): Promise<any> {
        console.log("Calling QnA Maker");
    
		const qnaResults = await this.qnaMaker.getAnswers(context);

		// If an answer was received from QnA Maker, send the answer back to the user.
		if (qnaResults[0]) {
			await context.sendActivity(qnaResults[0].answer);

			// If no answers were returned from QnA Maker, reply with help.
		} else {
			await context.sendActivity("No QnA Maker answers were found.");
		}

		// By calling next() you ensure that the next BotHandler is run.
		await next();
	}
}
