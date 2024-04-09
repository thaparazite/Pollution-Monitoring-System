const grpc = require('@grpc/grpc-js');// import grpc module
const protoLoader = require('@grpc/proto-loader');// import protoLoader module
const path = require('path');// import path module

const PROTO_PATH = path.join(__dirname,'/../protos/pollution_tracker.proto');// path to proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);// load proto file
const environment_proto = grpc.loadPackageDefinition(packageDefinition).pollution;// load pollution package 

// function that generates random pollution data
function generateRandomData() {

    return {
        locationId: ((Math.random() * 100).toFixed(6) + " , " + (Math.random() * -200).toFixed(6)).toString(),
        temperature: ((Math.random() * 50 + 10).toFixed(4)),
        humidity: ((Math.random() * 100).toFixed(4)),
        airQuality: ((Math.random() * 100).toFixed(4)),
        noiseLevel: ((Math.random() * 100).toFixed(4))
    };// end of return statement

}// end of generateRandomData function

// function to stream pollution data
function streamEnvironmentData(call) {

    // generate random data
    const randomData = generateRandomData();

    // send data to client
    call.write({
        locationId: randomData.locationId,
        temperature: randomData.temperature,
        humidity: randomData.humidity,
        airQuality: randomData.airQuality,
        noiseLevel: randomData.noiseLevel
    });// end of call.write function

}//end of streamEnvironmentData function

// main function
function main() {

    // create a new server
    const server = new grpc.Server();

    // add the services to server
    server.addService(environment_proto.EnvironmentServices.service,{
        HospitalEnvironmentService: streamEnvironmentData,
        BuildingEnvironmentService: streamEnvironmentData,
        OfficeEnvironmentService: streamEnvironmentData
    });// end of server.addService function

    // bind server to listen for incoming requests from all networks 0.0.0.0 on port 50051 
    server.bindAsync('0.0.0.0:50051',grpc.ServerCredentials.createInsecure(),(err,port) => {

        if (err) {// if error occurs 
            console.error(err);// display error message
            return;// exit the function 
        } else {
            // display message that server is running on port 50051
            console.log('Server is running on port: http://0.0.0.0:${port}');
            // starting the server can be omitted
            // server.start();// start the server
        }// end of if-else statement

    });// end of server.bind function

}// end of main function

main();// call main function