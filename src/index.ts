import { runServer } from './server';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

runServer(port);
