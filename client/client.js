const grpc = require('@grpc/grpc-js');// import grpc module
const protoLoader = require('@grpc/proto-loader');// import protoLoader module
const path = require('path');// import path module

const PROTO_PATH = path.join(__dirname,'/../protos/pollution_tracker.proto');// path to proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);// load proto file
const environment_proto = grpc.loadPackageDefinition(packageDefinition).pollution;// load pollution package 

// function to display options
function displayOptions() {

    console.log('\n\n-------------------------------------------------------------');// print separator
    console.log('\t    *** Pollution Monitoring System ***');// print system title
    console.log('-------------------------------------------------------------');// print separator
    console.log(' - Monitor Pollution Environment of Different Locations -');// print system description  
    console.log('-------------------------------------------------------------');// print separator
    console.log('\t     - Display Options - ');// print options title
    console.log('\t1. Hospital Environment Service');// print hospital service option
    console.log('\t2. Building Environment Service');// print building service option
    console.log('\t3. Office Environment Service');// print office service option
    console.log('\t4. All Services');// print  all services option
    console.log('-------------------------------------------------------------');// print separator

}//end of displayOptions function

const readline = require('readline');// import readline module

// create a readline interface
const rl = readline.createInterface({
    input: process.stdin,   // input comes from standard input
    output: process.stdout  // output goes to standard output
});// end of readline interface

const os = require('os');// import os module


// main function
function main() {

    // create a new client and connect to server running on port 50051 
    const client = new environment_proto.EnvironmentServices('localhost:50051',grpc.credentials.createInsecure());

    // get the network interfaces
    const networkInterfaces = os.networkInterfaces();

    // get the first non-internal IPv4 address
    let ip;// variable to store the IP address
    for (let name of Object.keys(networkInterfaces)) {
        for (let net of networkInterfaces[name]) {// iterate over the network interfaces
            if (!net.internal && net.family === 'IPv4') {// check if the network interface is not internal and is IPv4
                ip = net.address;// get the IP address
                break;// break the loop
            }// end of if block
        }// end of for loop
        if (ip) {// check if IP address is found
            break;// break the loop
        }// end of if block
    }// end of for loop

    var num;// variable to store the number of the service selected by the user

    // function to ask question to the user
    function askQuestion() {

        displayOptions();// display options

        function askServiceQuestion() {
            rl.question(' Enter the number of the service you want to display: ',(answer) => {
                num = parseInt(answer);// convert answer to integer
                // validate the input 
                if (isNaN(num) || num < 1 || num > 4) {
                    console.log('-------------------------------------------------------------');// print separator
                    console.log(' Invalid input. Please enter a number between 1 and 4.');
                    console.log('-------------------------------------------------------------');// print separator
                    askServiceQuestion(); // ask the question again
                    return;// exit the function
                }// end of if block

                console.log('-------------------------------------------------------------');// print separator
                switch (num) {
                    case 1:
                        displayService(client,'HospitalEnvironmentService','Hospital Environment Service',{ ip });// display hospital service
                        break;// break the switch statement
                    case 2:
                        displayService(client,'BuildingEnvironmentService','Building Environment Service',{ ip });// display building service
                        break;// break the switch statement
                    case 3:
                        displayService(client,'OfficeEnvironmentService','Office Environment Service',{ ip });// display office service
                        break;// break the switch statement
                    case 4:
                        displayService(client,'HospitalEnvironmentService','Hospital Environment Service',{ ip });// display hospital service
                        displayService(client,'BuildingEnvironmentService','Building Environment Service',{ ip });// display building service
                        displayService(client,'OfficeEnvironmentService','Office Environment Service',{ ip });// display office service
                        break;// break the switch statement
                }// end of switch
            });// end of rl.question
        }

        askServiceQuestion();// call askServiceQuestion function

    }// end of askQuestion function

    var counter1 = 0,counter2 = 0;// initialize counters
    // function to display service
    function displayService(client,service,title,options) {

        // Create metadata
        const metadata = new grpc.Metadata();// create metadata object
        const date = new Date();// get the current date and time 
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;// get the time zone 
        const dateStamp = date.toLocaleString('en-US',{ hour12: false });// get the date and time in the format: MM/DD/YYYY HH:MM:SS
        metadata.add('client-ip',`${options.ip}; Calling service: ${service}; Timestamp: ${dateStamp} ${timeZone}`);// add metadata to the object 


        // make the gRPC call, passing the metadata as the second argument
        const call = client[service]({},metadata);

        call.on('data',data => {
            /*
             * control the continue option
             * when the user selects option 4            
             *
             */
            if (num === 4) {
                ++counter2;// increment counter2
                if (counter2 === 3) {
                    counter1 = 0;// reset counter1
                    counter2 = 0;// reset counter2
                    ++counter1;// increment counter1
                }// end of if
            } else {
                ++counter1;// increment counter1
            }// end of if else

            // print data in table format 
            console.log(`\n${title}`);// print service title
            console.table(data);// print data in table format

            // control the continue option
            if (counter1 === 1) {
                try {
                    console.log('-------------------------------------------------------------');// print separator
                    function askContinueQuestion() {
                        rl.question(' Do you want to continue? (yes/no): ',(continueAnswer) => {
                            console.log('-------------------------------------------------------------');// print separator
                            continueAnswer = continueAnswer.toLowerCase();
                            if (continueAnswer === 'yes') {
                                askQuestion();// ask the question again
                            } else if (continueAnswer === 'no') {
                                console.log('\t *** End of Pollution Monitoring System ***');// print end message
                                console.log('-------------------------------------------------------------');// print separator
                                rl.close();// close readline interface
                                try {
                                    process.exit(0);// exit the process
                                } catch (err) {
                                    // handle error if process fails to exit
                                    console.error(' Failed to exit process:',err);
                                }// end of try catch
                            } else {
                                console.log(' Invalid input. Please enter "yes" or "no".');
                                console.log('-------------------------------------------------------------');// print separator
                                askContinueQuestion(); // ask the question again
                            }// end of if else
                        });
                    }// end of askContinueQuestion function
                    askContinueQuestion();
                } catch (err) {
                    console.error(' Failed to ask question:',err);
                }// end of try catch
                counter1 = 0;// reset counter1
            }// end of if block
        });// end of call.on

        call.on('error',error => {
            console.log('\n-------------------------------------------------------------------------------------------------------------------------------------------------------------------');// print separator 
            console.error(` Error during ${title}: ${error.message}`);// print error message 
            console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------');// print separator
        });// end of call.on

        call.on('end',function () {
            console.log('---------------------------------------');// print separator 
            console.log(' Server has finished sending data');// print message
            console.log('---------------------------------------');// print separator
            try {
                // close the readline interface
                rl.close();
                console.log('-------------------------------------------------------------');// print separator
                console.log('\t *** End of Pollution Monitoring System ***');// print end message
                console.log('-------------------------------------------------------------');// print separator
                process.exit(0);// exit the process
            } catch (err) {
                console.log('-------------------------------------------------------------');// print separator
                // handle error if process fails to exit
                console.error(' Failed to exit process:',err);
                console.log('-------------------------------------------------------------');// print separator
                console.log('\t *** End of Pollution Monitoring System ***');// print end message
                console.log('-------------------------------------------------------------');// print separator
                process.exit(1);// exit the process
            }// end of try catch
        });
    }// end of displayService function

    askQuestion();// call askQuestion function

}// end of main function

main();// call main function
