# healthcare-bots
SmartterHealth Bots. Coming Soon.

## Local Development
Setup for Local Development 

Tools Needed: 

* Install Visual Studio Code
* Install Git 
* Install Bot Framework Emulator

From the git bash (or bash on Mac/Linux), create a directory on your local computer for doing development type stuff. Mac/Linux users, please change the DEVDIR variable to suit your OS:

	DEVDIR=C:\development
	mkdir $DEVDIR && cd $DEV_DIR
	
Clone the repo by running the command:

	git clone https://github.com/SmartterHealth/healthcare-bots.git

Navigate to the workspace directory by running the command: 

	cd healthcare-bots

Run the following command from the workspace root directory: 

	gulp build && gulp package
	
You’ll need a special configuration file for environment settings. This will contain bot app ids, database credentials, etc. Create an .env file in the workspace root directory: 

	touch .env
	
You can also do this in one batch of commands:

	DEVDIR=C:\development
	mkdir $DEVDIR && cd $DEVDIR
	git clone https://github.com/SmartterHealth/healthcare-bots.git
	cd healthcare-bots
	gulp build && gulp package
	
