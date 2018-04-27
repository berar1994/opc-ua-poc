import Client from './Client';
import Publisher from './Publisher';

const client = new Client(Publisher);
client.start();
