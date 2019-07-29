import { TurnContext } from 'botbuilder';
import * as sql from 'mssql';
import 'reflect-metadata';
import  settings from '../../settings';
import { Command, CommandHandlerBase, Traceable, CommandStatus, ICommandResults } from '../CommandHandlerBase';
import { IICD10Code } from '../IICD10Code';
import { GetCodeAdaptiveCardHelper } from './GetCodeAdaptiveCardHelper';
import Icd2Bot from '../../index';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = false;

@Command('Get Code', ['gc', 'get code', 'code'], IS_DEFAULT)
export class GetCodeCommandHandler extends CommandHandlerBase {

    @Traceable()
    public async execute(context: TurnContext, command: string, args: string): Promise<ICommandResults> {
        args = (args === undefined || args === null) ? '' : args;
        args = args.trim();

        let code: IICD10Code | null = null;
        let cmdStatus: CommandStatus = CommandStatus.Success;
        let cmdStatusText: string;
        try {
            code = await getCode(args);
            if(code) {
                cmdStatusText = `ICD10 code **'${args}'** found!`;
            } else {
                cmdStatusText = `A code for **'${args}'** was not found. Please try again.`;
                cmdStatus = CommandStatus.FailNoError;
            }
        } catch (err) {
            cmdStatus = CommandStatus.Error;
            cmdStatusText = err.toString();
        }

        const card = new GetCodeAdaptiveCardHelper(context);
        card.args = args;
        card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> ${args}`;
        card.headerDescription = (cmdStatus == CommandStatus.Error) ? `An error has occured. Please contact your administrator.` : cmdStatusText;
        card.dataSource = code;

        await context.sendActivity({
            attachments: [card.render()],
        });

        return { status: (cmdStatus), message: cmdStatusText};
    }
}

async function getCode(code: string): Promise<IICD10Code | null> {
    const codes: IICD10Code[] = [];
    let result: IICD10Code | null = null;
    const pool = await sql.connect(settings.db);

    try {
        const dbresults = await pool.request()
            .input('code', sql.VarChar(150), code)
            .execute('GET_CODE');

        if (dbresults.recordset.length > 0) {
            result = dbresults.recordset[0] as IICD10Code;
        }
    } finally {
        sql.close();
    }
    return result;
}
