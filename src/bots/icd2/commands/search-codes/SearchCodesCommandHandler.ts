import { TurnContext } from 'botbuilder';
import * as sql from 'mssql';
import 'reflect-metadata';
import { Assert } from '../../assert';
import log from '../../logger';
import settings from '../../settings';
import { Command, CommandHandlerBase, CommandStatus, ICommandResults, Traceable } from '../CommandHandlerBase';
import { IICD10Code, IICD10SearchResults } from '../IICD10Code';
import { SearchCodesAdaptiveCardHelper } from './SearchCodesAdaptiveCardHelper';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = false;

@Command('Search Codes', ['search codes', 'sc', 'search code'], IS_DEFAULT)
export class SearchCodesCommandHandler extends CommandHandlerBase {

    @Traceable()
    public async execute(context: TurnContext, command: string, args: string): Promise<ICommandResults> {
        args = (args === undefined || args === null) ? '' : args;
        args = args.trim();

        let results: IICD10SearchResults | null = null;
        let cmdStatus: CommandStatus = CommandStatus.Success;
        let cmdStatusText: string;
        try {
            const query = parseKeywords(args);
            log(`Searching for codes using query '${query}'`);

            results = await searchCodes(query);
            log(`${results.codes.length} results returned for query '${query}'`);

            if (results.codes.length > 0) {
                // We got matches!
                cmdStatus = CommandStatus.Success;
                cmdStatusText = `Your search for **'${args}'** returned **${results.codes.length}** results. Click on a result for more details.`;
            } else {
                // No matches... :-/
                cmdStatus = CommandStatus.FailNoError;
                cmdStatusText = `Your search for **'${args}'** returned **${results.codes.length}** results. Please try again.`;
            }
        } catch (err) {
            console.log(err);
            cmdStatus = CommandStatus.Error;
            cmdStatusText = err.toString();
        }

        const card = new SearchCodesAdaptiveCardHelper(context);
        card.args = args;
        card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> ${args}`;
        // Hide error messages with generic message.
        card.headerDescription = (cmdStatus === CommandStatus.Error) ? `An error has occured. Please contact your administrator.` : cmdStatusText;
        card.dataSource = results;

        // await context.sendActivity('Test');
        await context.sendActivity({
            attachments: [card.render()],
        });

        return { status: cmdStatus, message: cmdStatusText};
    }
}

/**
 * Parses the keywords into a SQL fulltext WHERE clause.
 * @param keywords The keywords to parse. Each keyword is joined by the SQL 'AND' operator. Phrases are identified by quotes.
 */
function parseKeywords(keywords: string): string  {
    Assert.isNotNull<String>(keywords, String);
    const regex = /("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*/gi;
    const tokens = keywords.match(regex);
    if (tokens != null) {
        return tokens.join(' AND ');
    }
    return '';
}

/**
 * Calls the stored procedure that searches for ICD10 codes.
 * @param query The SQL fulltext WHERE clause.
 */
async function searchCodes(query: string): Promise<IICD10SearchResults> {
    Assert.isNotNull<string>(query, String);
    const codes: IICD10Code[] = [];
    const results: IICD10SearchResults = { codes: (codes) };
    const pool = await sql.connect(settings.db);

    try {
        const dbresults = await pool.request()
            .input('keywords', sql.VarChar(150), query)
            .input('maxrows', sql.Int, settings.searchCodes.maxRows)
            .execute('SEARCH_CODES');

        results.codes = dbresults.recordset as IICD10Code[];

    } finally {
        sql.close();
    }

    return results;
}
