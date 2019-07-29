import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { IICD10Code } from '../IICD10Code';
import { CardFactory, Attachment } from 'botbuilder';
import { Assert } from '../../assert';
import * as path from 'path';

export class GetCodeAdaptiveCardHelper extends AdaptiveCardHelperBase {

    private _dataSource: IICD10Code | null;

    public get dataSource(): IICD10Code | null {
        return this._dataSource;
    }

    public set dataSource(value: IICD10Code | null) {
        this._dataSource = value;
    }

    public render(): Attachment {
        this.renderCore();
        this.renderBingSearch();
        return CardFactory.adaptiveCard(this.card);
    }

    /**
     * Renders the main part of the adaptive card.
     */
    private renderCore() {

        if (this.dataSource != null) {
            // Load the JSON template, and set code, description, and chapter.
            let template = AdaptiveCardHelperBase.loadCardElementJSON(path.join(__dirname, './GetCodeAdaptiveCardHelper.json'));

            template.items[0].columns[1].items[0].text = this.dataSource.code;
            template.items[1].columns[1].items[0].text = this.dataSource.description;
            template.items[2].columns[1].items[0].text = this.dataSource.chapter;
            template.items[3].columns[1].items[0].text = (this.dataSource.hipaa) ? 'yes' : 'no';

            // Append to the card's body.
            this.card.body.push(template);
        }
    }

    /**
     * Renders the Bing Search button, which will execute a Bing query for the specified ICD10 code.
     */
    private renderBingSearch() {

        if (this.dataSource != null) {
            // Create the action button.
            const bingSearchAction = this.createAction({
                title: 'Open in Bing Search',
                url: `https://www.bing.com/search?q=icd10 code ${this.dataSource.code}`,
                actionType: CardActionType.OpenUrl,
                iconUrl: 'https://i.imgur.com/oV6TgTL.png'
            });

            // Create the actions array and and the action button.
            this.card.actions = [];
            this.card.actions.push(bingSearchAction);
        }
    }
}