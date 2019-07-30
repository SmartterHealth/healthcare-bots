import { Attachment, TurnContext } from 'botbuilder';
import * as path from 'path';
import { Assert } from '../assert';

export abstract class AdaptiveCardHelperBase {

    protected get card() {
        return this._card;
    }

    public get args(): string {
        return this._args;
    }

    public set args(value: string) {
        this._args = value;
    }

    public get context(): TurnContext {
        return this._context;
    }
    public set context(v: TurnContext) {
        this._context = v;
    }

    public get headerDescription(): string {
        return this.card.body[1].items[0].text.text;
    }
    public set headerDescription(v: string) {
        this.card.body[1].items[0].text = v;
    }

    public get headerTitle(): string {
        return this.card.body[0].items[0].columns[1].items[0].text;
    }
    public set headerTitle(v: string) {
        this.card.body[0].items[0].columns[1].items[0].text = v;
    }

    public get isMSTeams(): boolean {
        return (this.context != null && this.context.activity.channelId != null && this.context.activity.channelId !== undefined && this.context.activity.channelId === 'msteams');
    }

    public static loadCardElementJSON(pathToTemplate: string): any {
        const template = (require(pathToTemplate));
        return JSON.parse(JSON.stringify(template));
    }

    private _card;
    private _args: string;
    private _context: TurnContext;

    constructor(context: TurnContext) {

        Assert.isNotNull<TurnContext>(context, TurnContext);
        this._context = context;
        this._card = AdaptiveCardHelperBase.loadCardElementJSON(path.join(__dirname, './AdaptiveCardTemplate.json'));
    }

    public abstract render(): Attachment;

    protected createAction(options: ICardAction) {

        const action = Object.assign({}, options);
        action.type = `Action.${CardActionType[options.actionType]}`;

        if (this.isMSTeams === true) {
            action.data = {
                msteams: {
                    type: 'messageBack',
                    text: options.data,
                    displayText: options.data,
                    value: options.data,
                },
            };
        }

        return action;
    }

    protected submitAction(data: any, text?: string, displayText?: string) {

        const action = {
            type: 'Action.Submit',
            text,
            data,
        };

        if (this.isMSTeams === true) {
            action.data = {
                msteams: {
                    type: 'messageBack',
                    text,
                    displayText,
                    value: data,
                },
            };
        }

        return action;
    }
}

export type CardActionTypeName = 'Action.Submit' | 'Action.OpenUrl';

export interface ICardAction {
    id?: string;
    title: string;
    actionType: CardActionType;
    type?: string;
    iconUrl?: string;
    data?: any;
    url?: string;
}

export enum CardActionType {
    OpenUrl,
    Submit,
}
