import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';
import * as path from 'path';

export class SearchCodesHelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    render(): Attachment {
        let template = AdaptiveCardHelperBase.loadCardElementJSON(path.join(__dirname, './SearchCodesHelpAdaptiveCardHelper.json'));
        this.card.body.push(template);

        this.card.actions = [];
        this.card.actions.push(this.createAction({ title: 'Try it now!', actionType: CardActionType.Submit, data: 'search codes edema orbit'}));

        return CardFactory.adaptiveCard(this.card);
    }
}