import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';
import * as path from 'path';

export class WelcomeAdaptiveCardHelper extends AdaptiveCardHelperBase {
    
    render(): Attachment {
        return CardFactory.adaptiveCard(this.card);
    }
}