import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';
import * as path from 'path';

export class GetCodeHelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    render(): Attachment {
        let template = AdaptiveCardHelperBase.loadCardElementJSON(path.join(__dirname, './GetCodeHelpAdaptiveCardHelper.json'));
        this.card.body.push(template);

        this.card.actions = [];
        this.card.actions.push(this.createAction({ title: 'Try it now!', actionType: CardActionType.Submit, data: 'get code h0522'}));
        return CardFactory.adaptiveCard(this.card);
    }
}