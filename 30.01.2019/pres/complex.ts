#!/usr/bin/env ts-node
import axios from 'axios';
import { tryMax } from 'trymax';

const baseUrl = 'http://localhost:3000';
const maxAttempts = 5;

interface Book {
    id: string;
    title: string;
}

const getBook = (bookId: string) => 
    tryMax(maxAttempts)
        .of(axios.get)
        .execute(`${baseUrl}/books/${bookId}`)
        .then(res => res.data);

const postBook = (book: Book) =>
    tryMax(maxAttempts)
        .of(axios.post)
        .retryIf(async () => {
            try {
                const resp = await getBook(book.id);
                console.log('Intercepting...');
                return resp;
            }catch{
                console.log('Retry');
                return true;
            }
        })
        .execute(`${baseUrl}/books`, book)
        .then(res => res.data);

async function main() {
    const newBook: Book = {
        id: Math.ceil(Math.random() * 1000).toString(),
        title: 'All\'s well that ends well'
    };

    await postBook(newBook);

    const resp = await getBook(newBook.id);

    console.log(resp);
}

main();
