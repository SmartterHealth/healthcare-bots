import * as dotenv from 'dotenv';
import * as util from './util';

dotenv.config();

/**
 * IMPORTANT: Ensure that bot settings have unique prefix!
 */
const settings = {
    bot: {
        displayName: 'ICD2 Bot',
        /** The ID of the bot registered in Azure. */
        MicrosoftAppId: process.env['icd2.MicrosoftAppId'],
        /** The password/secret of the bot registered in Azure. */
        MicrosoftAppPassword: process.env['icd2.MicrosoftAppPassword']        
    },
     /** Exposes Azure Application Insights settings from ENV. */
     appInsights: {
        /** The Azure Insights nstumentation key. You can get this value from your App Insights instance in the Azure Portal. */
        instrumentationKey: process.env['icd2.APPINSIGHTS_INSTRUMENTATIONKEY'],

        /** Disables Azure App Insights. Specify a 1 (disabled) or 0 (enabled) in your ENV file or Azure App Service configuration. */
        disabled: util.convertToBoolean(process.env['icd2.APPINSIGHTS_DISABLED'])
    },
    /** Exposes code search settings from ENV. */
    searchCodes: {
        /** The maximum number of rows to return for an ICD10 code search. */
        maxRows: util.convertToInteger(process.env.SC_MAXROWS, 25),
    },
    /** Exposes database settings from ENV. */
    db: {
        /** The FQDN of the SQL Server instance. */
        server: process.env['icd2.DbServer'],

        /** The name of the SQL Server database. */
        database: process.env['icd2.DbName'],

        /** The user id for the SQL Server database. */
        user: process.env['icd2.DbUserId'],

        /** The password for the SQL Server database. */
        password: process.env['icd2.DbPassword'],

        /** SQL Server options.  */
        options: {
            /** Must be TRUE for SQL Server in Azure. */
            "encrypt": true,
        },
    },
}

if(process.env.NODE_ENV === 'DEVELOPMENT') {
    console.log('Icd2Bot Settings:', settings)
}

export default settings;