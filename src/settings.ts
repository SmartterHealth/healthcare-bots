import { config } from 'dotenv';

config();

const settings = {
	bots: {
        port: process.env.port || process.env.PORT || 3978        
	},
	
};

export default settings;
