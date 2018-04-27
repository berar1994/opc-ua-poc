import os from 'os';

import { Client } from './features';

const endpointUrl = `opc.tcp://${os.hostname()}:4334/UA/MyLittleServer`;

const client = new Client(endpointUrl);
client.start(endpointUrl);
