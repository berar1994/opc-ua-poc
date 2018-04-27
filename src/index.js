import { Client } from './features';

const endpointUrl = 'opc.tcp://opcuademo.sterfive.com:26543';

const client = new Client(endpointUrl);
client.start(endpointUrl);
