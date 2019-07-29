import { TurnContext } from 'botbuilder';
import { Command, CommandHandlerBase, Traceable, ICommandResults, CommandStatus } from '../CommandHandlerBase';
import log from '../../logger';
import { HelpAdaptiveCardHelper } from './HelpAdaptiveCardHelper';
import settings from '../../settings';
import { AdaptiveCardHelperBase } from '../AdaptiveCardHelperBase';
import { SearchCodesHelpAdaptiveCardHelper } from './SearchCodesHelpAdaptiveCardHelper';
import { GetCodeHelpAdaptiveCardHelper } from './GetCodeHelpAdaptiveCardHelper';
import * as appInsights from 'applicationinsights';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = false;
@Command('Help', ['help'], IS_DEFAULT)
export class HelpCommandHandler extends CommandHandlerBase {

    @Traceable()
    public async execute(context: TurnContext, command: string, args: string): Promise<ICommandResults> {
        let client = appInsights.defaultClient;

        args = (args === undefined || args === null) ? '' : args;

        const card = this.determineCardHelper(args, context);

        await context.sendActivity({
            attachments: [card.render()],
        });

        return { status: CommandStatus.Success, message: `Command ${this.displayName} executed successfully.`};
    }

    private determineCardHelper(args: string, context: TurnContext): AdaptiveCardHelperBase {
        let card: AdaptiveCardHelperBase;
        switch(args.toLowerCase()) {
            case 'search codes':
                card = new SearchCodesHelpAdaptiveCardHelper(context);
                card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> Search Codes`;
                card.headerDescription = `Searching for ICD10 codes by keyword is easy!`;
                break;

            case 'get code':
                    card = new GetCodeHelpAdaptiveCardHelper(context);
                    card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> Get Code`;
                    card.headerDescription = `Getting details for an ICD10 code is easy!`;
                    break;

            default:
                card = new HelpAdaptiveCardHelper(context);
                card.headerTitle = `${settings.bot.displayName} -> ${this.displayName}`;
                card.headerDescription = `Welcome to ICD2 Bot, ${context.activity.from.name}! This bot will assist you with ICD10 codes. Please select an option below. You can return to this screen at any time by typing **help**.`;
                break;
        }

        card.args = args;
        return card;
    }
}
