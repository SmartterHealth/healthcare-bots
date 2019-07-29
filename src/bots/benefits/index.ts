// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { ActivityHandler, BotFrameworkAdapter, TurnContext } from "botbuilder";
import settings from "./settings";
const { QnAMaker } = require("botbuilder-ai");

export default class BenefitsBot extends ActivityHandler {
	private adapter: BotFrameworkAdapter;
	private qnaMaker: any;

	constructor(server: any) {
		super();

		this.initAdapter(server);
		this.initQnAMaker();

		this.onMessage((context, next) => this.handleOnMessage(context, next));
		this.onMembersAdded((context, next) => this.handleOnMembersAdded(context, next));
	}

	private initQnAMaker() {
		// try {
			this.qnaMaker = new QnAMaker({
				knowledgeBaseId: settings.bot.QnAKnowledgebaseId,
				endpointKey: settings.bot.QnAEndpointKey,
				host: settings.bot.QnAEndpointHostName,
			});
		 	console.log(this.qnaMaker);
		// } catch (err) {
		// 	console.warn(`QnAMaker Exception: ${err} Check your QnAMaker configuration in .env`);
		// }
	}

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
		this.adapter.onTurnError = async (context, error) => {
			// This check writes out errors to console log .vs. app insights.
			console.error(`\n [onTurnError]: ${(error)}`);
			// Send a message to the user
			await context.sendActivity(`Oops. Something went wrong!`);
		};
	}

	private async handleOnMembersAdded(
		context: TurnContext,
		next: () => Promise<void>
	): Promise<any> {
		const membersAdded = context.activity.membersAdded;
		if (membersAdded != null) {
			for (const member of membersAdded) {
				if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity("Benefits: Hello and welcome!");
                    console.log(this.qnaMaker)
				}
			}
		}
		// By calling next() you ensure that the next BotHandler is run.
		await next();
	}

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
