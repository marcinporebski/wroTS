#!/usr/bin/env ts-node
import * as express from 'express';
import * as yargs from 'yargs';

const argv = yargs
        .usage('Usage: $0 --port [num] --sla [num]')
        .demand(['port', 'sla'])
        .number(['port', 'sla'])
        .argv;

const app = express();

app.get('/', (req, res) => {
    if (Math.random() > argv.sla / 100) {
        return res
                .status(500)
                .send('I\'ll be back');    
    }

    return res.send('Hello World!');
});

app.listen(argv.port, () => console.log(`Server running at http://localhost:${argv.port}`));
