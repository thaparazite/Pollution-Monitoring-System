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



// main function
function main() {

    // create a new client and connect to server running on port 50051 
    const client = new environment_proto.EnvironmentServices('localhost:50051',grpc.credentials.createInsecure());
    /*
    // display options
    displayOptions();

    // create a call to the hospital service
    const hospitalCall = client.HospitalEnvironmentService({});
    //listen for data from the server
    hospitalCall.on('data',data => printEnvironmentData('Hospital Environment Service',data));
    hospitalCall.on('end',() => console.log('Hospital data stream has ended'));
    hospitalCall.on('error',error => console.error(error));

    // create a call to the building service
    const buildingCall = client.BuildingEnvironmentService({});
    //listen for data from the server
    buildingCall.on('data',data => printEnvironmentData('Building Environment Service',data));
    buildingCall.on('end',() => console.log('Building data stream has ended'));
    buildingCall.on('error',error => console.error(error));

    // create a call to the office service
    const officeCall = client.OfficeEnvironmentService({});
    //listen for data from the server
    officeCall.on('data',data => printEnvironmentData('OfficeEnvironmentService',data));
    officeCall.on('end',() => console.log('Office data stream has ended'));
    officeCall.on('error',error => console.error(error));
    */


    function askQuestion() {

        displayOptions();// display options

        rl.question('Enter the number of the service you want to display: ',(answer) => {

            console.log('-------------------------------------------------------------');// print separator
            switch (answer) {
                case '1':
                case '2':
                case '3':
                case '4':
                default:
            }// end of switch

        });// end of rl.question

    }

}// end of main function

main();// call main function