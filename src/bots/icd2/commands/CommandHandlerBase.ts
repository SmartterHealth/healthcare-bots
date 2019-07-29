import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import  log from '../logger';
import  settings from '../settings';
import * as appInsights from 'applicationinsights';

export function Traceable(prefix: string = 'ICD2 Command'): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;
        // Wrapping the original method
        descriptor.value = async function (...args: any[]) {
            let result: ICommandResults | null = null;
            let context: TurnContext = args[0];
            try {
                // Simple trace
                log(`Invoked ${prefix} '${target.displayName}' with the following arguments '${args[2]}'`);
                result = await originalMethod.apply(this, args)
            } finally {

                if (result != null) {
                    log(`Invoked ${prefix} '${target.displayName}' with the following results '${result.message}'`);

                    // Custom event tracking in Azure AppInsights.
                    if (settings.appInsights.disabled == false) {
                        let client = appInsights.defaultClient;
                        client.trackEvent({
                            'name': prefix,
                            properties: {
                                commandText: '' + args[1],
                                commandName: target.displayName,
                                commandStatus: '' + result.status,
                                commandStatusText: result.message,
                                channelId: context.activity.channelId,
                                args: '' + args[2]
                            }
                        });
                    }
                }

                return result;
            }
        }

    }
}

/**
 * Class decorator that exposes command metadata to the BotCommandAdapter.
 * @param displayName The friendly name for the command.
 * @param commands A list of aliases for the command.
 * @param isDefault A flag that indicates whether the command is the default command.
 */
export function Command(displayName: string, commands: string[], isDefault = false): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return (target: (Function)) => {
        // Add class metadata. For more information on TypeScript decorators, please see https://aka.ms/tsdecorators.
        Reflect.defineMetadata('displayName', displayName, target);
        Reflect.defineMetadata('commands', commands, target);
        Reflect.defineMetadata('isDefault', isDefault, target);
    };
}

/**
 * Base class that implements shared command handler properties and behavior.
 */
export abstract class CommandHandlerBase {

    /** Gets the friendly name for the command. */
    public get displayName(): string {
        if (this._displayName === undefined) { this._displayName = Reflect.getMetadata('displayName', this.constructor) }
        return this._displayName; 
    }

    /** Gets a list of aliases for the command. */
    public get commands(): string[] {
        if (this._commands === undefined) { this._commands = Reflect.getMetadata('commands', this.constructor) }
        return this._commands;
    }

    /** Gets a flag that indicates whether the command is the default command. */
    public get isDefault(): boolean {
        if (this._isDefault === undefined) { this._isDefault = Reflect.getMetadata('isDefault', this.constructor) }
        return this._isDefault;
    }

    /**
     * Factory method that creates a new command based on the type argument.
     * @param type The type of command to create.
     */
    public static createInstance(type: typeof CommandHandlerBase): CommandHandlerBase {
        const instance = Object.create(type.prototype);
        return instance;
    }

    /** Private field that stores the friendly name for the command.  */
    private _displayName: string;
    /** Private field that stores a list of aliases for the command. */
    private _commands: string[];
    /** Private field that stores a flag that indicates whether the command is the default command. */
    private _isDefault: boolean;

    /**
     * Executes the command.
     * @param context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param args The arguments send to the command.
     */
    public abstract execute(context: TurnContext, command: string, args: string): Promise<ICommandResults>;
}

export enum CommandStatus {
    Success,
    FailNoError,
    Error
}

export interface ICommandResults {
    status: CommandStatus,
    message: string,
    error?: Error
}
