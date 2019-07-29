import { TurnContext } from 'botbuilder';
import { Command, CommandHandlerBase, Traceable, ICommandResults, CommandStatus } from '../CommandHandlerBase';
import log from '../../logger';
import { WelcomeAdaptiveCardHelper } from './WelcomeAdaptiveCardHelper';
import settings from '../../settings';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = true;

/**
 * 
 */
@Command('Welcome', ['w', 'welcome'], IS_DEFAULT)
export class WelcomeCommandHandler extends CommandHandlerBase {

    /**
     * 
     * @param context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param args The arguments sent to the command.
     */
    @Traceable()
    public async execute(context: TurnContext, command: string, args: string): Promise<ICommandResults> {

        let card = new WelcomeAdaptiveCardHelper(context);
        card.headerTitle = settings.bot.displayName;
        card.headerDescription = `Welcome, ${context.activity.from.name}! Enter a command or type *'help'* to begin.`;

        await context.sendActivity({
            attachments: [card.render()],
        });

        return { status: CommandStatus.Success, message: `Command ${this.displayName} executed successfully.`};
    }
}