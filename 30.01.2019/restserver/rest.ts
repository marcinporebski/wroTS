#!/usr/bin/env ts-node
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as yargs from 'yargs';

const argv = yargs
        .usage('Usage: $0 --port [num] --sla [num]')
        .demand(['port', 'sla'])
        .number(['port', 'sla'])
        .argv;

const app = express();
const meetsSla = () => Math.random() < argv.sla / 100;

const storage = new Map<string, Map<string, object>>();
const getRepo = (type: string) => {
    let repo = storage.get(type);
    if (!repo) {
        storage.set(type, new Map<string, object>());
        repo = storage.get(type);
    }

    return repo;
};

app.use(bodyParser.json());
app.use((_, res, next) => {
    if (!meetsSla()) {
        return res.status(500).send('Oops');
    }
    next();
});

app.get('/:type', (req, res) => {
    const { type } = req.params;
    const repo = getRepo(type);

    res.send(Array.from(repo.values()));
});

app.post('/:type', (req, res) => {
    const { type } = req.params;
    const { id } = req.body;
    const repo = getRepo(type);

    if (!id) {
        throw new Error('No element id provided.');
    }

    repo.set(id, req.body);

    if (!meetsSla()) {
        return res.status(500).send('Oops');
    }

    return res.send(req.body);
});

app.get('/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const repo = getRepo(type);

    const element = repo.get(id);
    if (!element) {
        throw new Error(`Entry with id ${id} not found in ${type}`);
    }

    return res.send(element);
});

app.listen(argv.port, () => console.log(`Server running at http://localhost:${argv.port}`));
