const grpc = require('grpc');// import grpc module
const protoLoader = require('@grpc/proto-loader');// import protoLoader module
const path = require('path');// import path module

const PROTO_PATH = path.join(__dirname,'/../protos/pollution_tracker.proto');// path to proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);// load proto file
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).pollution;// load pollution package 

// function that generates random pollution data
function generateRandomData() {

    return {
        locationId: ((Math.random() * 100).toFixed(6) + " , " + (Math.random() * -200).toFixed(6)).toString(),
        temperature: ((Math.random() * 50 + 10).toFixed(4)),
        humidity: ((Math.random() * 100).toFixed(4)),
        airQuality: ((Math.random() * 100).toFixed(4)),
        noiseLevel: ((Math.random() * 100).toFixed(4)),
    };// end of return statement

}// end of generateRandomData function

