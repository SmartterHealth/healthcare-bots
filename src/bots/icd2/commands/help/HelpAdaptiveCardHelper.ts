import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';
import * as path from 'path';

export class HelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    
    render(): Attachment {

        this.card.actions = [];
        this.card.actions.push(this.createAction({ title: 'Search Codes by Keyword(s)', actionType: CardActionType.Submit, data: 'help search codes'}));
        this.card.actions.push(this.createAction({ title: 'Get Code Details', actionType: CardActionType.Submit, data: 'help get code'}));

        return CardFactory.adaptiveCard(this.card);
    }
}