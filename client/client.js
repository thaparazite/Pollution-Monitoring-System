const grpc = require('@grpc/grpc-js');// import grpc module
const protoLoader = require('@grpc/proto-loader');// import protoLoader module
const path = require('path');// import path module

const PROTO_PATH = path.join(__dirname,'/../protos/pollution_tracker.proto');// path to proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);// load proto file
const environment_proto = grpc.loadPackageDefinition(packageDefinition).pollution;// load pollution package 
/*
// function to print environment data
function printEnvironmentData(data) {

    console.log(' Location ID: ' + data.locationId);
    console.log(' Temperature: ' + data.temperature);
    console.log(' Humidity:    ' + data.humidity);
    console.log(' Air Quality: ' + data.airQuality);
    console.log(' Noise Level: ' + data.noiseLevel);
    console.log('');// empty line

}// end of printEnvironmentData function
*/

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

    //
}//end of displayOptions function

/*
// function to print environment data
function printEnvironmentData(serviceTitle,data) {
    console.log(`\n${serviceTitle}`);// print service title
    console.table(data);// print data in table format
}// end of printEnvironmentData function
*/

const readline = require('readline');// import readline module
// create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});// end of readline interface


var num;
// main function
function main() {

    // create a new client and connect to server running on port 50051 
    const client = new environment_proto.EnvironmentServices('localhost:50051',grpc.credentials.createInsecure());

    function askQuestion() {

        displayOptions();// display options

        rl.question('Enter the number of the service you want to display: ',(answer) => {
            num = parseInt(answer);// convert answer to integer
            console.log('-------------------------------------------------------------');// print separator
            switch (answer) {
                case '1':
                    displayService(client,'HospitalEnvironmentService','Hospital Environment Service');// display hospital service
                    break;
                case '2':
                    displayService(client,'BuildingEnvironmentService','Building Environment Service');// display building service
                    break;
                case '3':
                    displayService(client,'OfficeEnvironmentService','Office Environment Service');// display office service
                    break;
                case '4':
                    displayService(client,'HospitalEnvironmentService','Hospital Environment Service');// display hospital service
                    displayService(client,'BuildingEnvironmentService','Building Environment Service');// display building service
                    displayService(client,'OfficeEnvironmentService','Office Environment Service');// display office service
                    break
                default:
                    console.log('Invalid Option. Enter a Number Between 1 and 4');// print error message
                    console.log('-------------------------------------------------------------');// print separator
                    askQuestion();// ask the question again
                    return;// exit the function
            }// end of switch

        });// end of rl.question

    }// end of askQuestion function

    var counter1 = 0,counter2 = 0;// initialize counters
    // function to display service
    function displayService(client,service,title) {

        const call = client[service]({});// create a call to the service

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

            if (counter1 === 1) {
                console.log('-------------------------------------------------------------');// print separator
                rl.question('Do you want to continue? (yes/no): ',(continueAnswer) => {
                    console.log('-------------------------------------------------------------');// print separator
                    if (continueAnswer.toLowerCase() === 'yes') {
                        askQuestion();// ask the question again
                    } else {
                        console.log('-------------------------------------------------------------');// print separator
                        console.log('\t *** End of Pollution Monitoring System ***');// print end message
                        console.log('-------------------------------------------------------------');// print separator
                        rl.close();// close readline interface
                        process.exit(0);// exit the process
                    }// end of if else
                });
                counter1 = 0;// reset counter1
            }// end of if block
        });// end of call.on

    }// end of displayService function

    askQuestion();// call askQuestion function

}// end of main function

main();// call main function
