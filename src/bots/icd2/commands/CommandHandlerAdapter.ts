import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { Command, CommandHandlerBase } from './CommandHandlerBase';
export class CommandHandlerAdapter {

    /** Private field that stores a list of all known command handler types. */
    private _commandTypes: Array<typeof CommandHandlerBase> = [];
    private _possibleCommands: string[] = [];
    private _commandTextParser: string = '';
    /** Private field that stores a mapping of command text to the associated command handler. */
    private _commandMapping = {};

    constructor(commandTypes: Array<typeof CommandHandlerBase>) {

        this.initCommandTypes(commandTypes);

        /// ^(search\s*codes|get\s*code|help)\s*(.*)$/gim;
        this._commandTextParser = `^(${this._possibleCommands.join('|')})\s*(.*)$`;
    }

    public async execute(context: TurnContext, commandText: string) {
        const re = new RegExp(this._commandTextParser, 'gim');
        const matches = re.exec(commandText);
        let cmd: CommandHandlerBase;
        let args: string;
        let commandAlias: string = '';

        if (!matches || matches.length < 3) {
            // We didn't find any commands that matches the commandText input, so use the default.
            // tslint:disable-next-line:no-string-literal
            cmd = this._commandMapping['default'];
            commandAlias = cmd.commands[0];
            args = '';
        } else {
            // We found a match, so grab the commandText and the arguments
            commandAlias = matches[1].trim();
            args = matches[2];
            cmd = this._commandMapping[commandAlias.toLowerCase().trim()];
        }

        // Execute the command.
        await cmd.execute(context, commandAlias.toLowerCase().trim(), (args).trim());
    
    }

    private initCommandTypes(registrations: Array<typeof CommandHandlerBase>) {
        this._commandTypes = registrations;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._commandTypes.length; i++) {
            // Grab the command handler type from our registration list.
            const registration = this._commandTypes[i];

            // Grab command handler metadata
            const displayName = Reflect.getMetadata('displayName', registration);
            const isDefault = Reflect.getMetadata('isDefault', registration);
            const commands = Reflect.getMetadata('commands', registration);

            /** Create an instance of our command handler, and map each command text to that instance
            * This mapping will look something like this in memory:
            * -----------------------------------------
            * Command Text     Command Handler Instance
            * -----------------------------------------
            * search codes     SearchCodesBotCommand
            * sc               SearchCodesBotCommand
            * get codes        GetCodeBotCommand
            * gc               GetCodeBotCommand
            * help             HelpBotCommand
            * welcome          WelcomeBotCommand
             */
            const instance: CommandHandlerBase = (CommandHandlerBase.createInstance(registration));
            commands.map((command) => {
                this._commandMapping[command] = instance;
            });

            // Register the default command
            if (isDefault) {
                if (instance != null) {
                // tslint:disable-next-line:no-string-literal
                this._commandMapping['default'] = instance; }
            }

            this._possibleCommands = this._possibleCommands.concat(commands);
        }
    }
}
