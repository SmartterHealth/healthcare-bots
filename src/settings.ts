const keys = {
	icd2: "icd2",
	benefits: "benefits",
};

const settings = {
	bots: {
        port: process.env.port || process.env.PORT || 3978,
        icd2: {
            port: process.env.port || process.env.PORT || 3978,
            appId: process.env[`${keys.icd2}.MicrosoftAppId`],
            appPassword: process.env[`${keys.icd2}.MicrosoftAppPassword`],
        },
        benefits: {
            port: process.env.port || process.env.PORT || 3978,
            appId: process.env[`${keys.benefits}.MicrosoftAppId`],
            appPassword: process.env[`${keys.benefits}.MicrosoftAppPassword`],
        },
	},
	
};

export default settings;
