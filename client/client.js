const grpc = require('@grpc/grpc-js');// import grpc module
const protoLoader = require('@grpc/proto-loader');// import protoLoader module
const path = require('path');// import path module

const PROTO_PATH = path.join(__dirname,'/../protos/pollution_tracker.proto');// path to proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);// load proto file
const environment_proto = grpc.loadPackageDefinition(packageDefinition).pollution;// load pollution package 

// function to print environment data
function printEnvironmentData(data) {

    console.log(' Location ID: ' + data.locationId);
    console.log(' Temperature: ' + data.temperature);
    console.log(' Humidity:    ' + data.humidity);
    console.log(' Air Quality: ' + data.airQuality);
    console.log(' Noise Level: ' + data.noiseLevel);
    console.log('');// empty line

}// end of printEnvironmentData function

// main function
function main() {

    // create a new client and connect to server running on port 50051 
    const client = new environment_proto.EnvironmentServices('localhost:50051',grpc.credentials.createInsecure());

    // create a call to the hospital service
    const hospitalCall = client.HospitalEnvironmentService({});
    //listen for data from the server
    hospitalCall.on('data',data => printEnvironmentData(data));
    hospitalCall.on('end',() => console.log('Hospital data stream has ended'));
    hospitalCall.on('error',error => console.error(error));

    // create a call to the building service
    const buildingCall = client.BuildingEnvironmentService({});
    //listen for data from the server
    buildingCall.on('data',data => printEnvironmentData(data));
    buildingCall.on('end',() => console.log('Building data stream has ended'));
    buildingCall.on('error',error => console.error(error));

    // create a call to the office service
    const officeCall = client.OfficeEnvironmentService({});
    //listen for data from the server
    officeCall.on('data',data => printEnvironmentData(data));
    officeCall.on('end',() => console.log('Office data stream has ended'));
    officeCall.on('error',error => console.error(error));

}// end of main function

main();// call main function