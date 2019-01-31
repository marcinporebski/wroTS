#!/usr/bin/env ts-node
import axios from 'axios';
import { tryMax } from 'trymax';

const theUrl = 'http://localhost:3000';

async function main() {
    const errorProneGet = axios.get;
    const transientErrorSafeGet = tryMax(10, errorProneGet);
    const resp = await transientErrorSafeGet(theUrl);
    
    console.log(resp.data);
}

main();