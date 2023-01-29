import { v4 as uuidv4 } from 'uuid';
import { promise, VoidResponsePromise } from 'mk713';
import { apiProvider } from 'mk713-api';

import { AuthorModel, BookModel } from './models';
import { libraryRepository } from './repository';

export namespace libraryStealService {
    export function stealAuthor(author_name: string){
        console.log(`Author steal start: ${author_name}`);

        apiProvider.get<AuthorResponse>(`https://openlibrary.org/search/authors.json?q=${author_name}`, { })
            .then((authors) => {
                console.log(authors.numFound);
                performAuthorSteal(authors.docs, 0)
                    .then(() => {
                        console.log('the end');
                    })
                    .catch((error) => {
                        console.error(error.error);
                    });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
    export function stealBooks(author: AuthorModel){
        console.log(`Looking for books by: ${author.name}`);

        apiProvider.get<BooksResponse>(`https://openlibrary.org/authors/${author.ol_key}/works.json`, { })
            .then((books) => {
                console.log(books.size);
                performBookSteal(author, books.entries, 0)
                    .then(() => {
                        console.log('Completed');
                    })
                    .catch((error) => {
                        console.error(error.error);
                    });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}

function performAuthorSteal(authors: AuthorData[], added: number): VoidResponsePromise{
    return promise.createVoidPromise((resolve, reject) => {
        if (authors.length > 0){
            const author = authors.pop();
            console.log(`Author: ${author.name}, Works: ${author.work_count}`);
            promise.check(libraryRepository.getFilteredAuthors(author.name, undefined, author.birth_date, author.key), reject)
                .then((data) => {
                    if (data.length == 0){
                        //import!
                        promise.check(libraryRepository.createAuthor(new AuthorModel().fromData(uuidv4(), author.name, '--', author.birth_date, author.key)), reject)
                            .then(() => {
                                added = added + 1;
                                console.log(`added: ${added}, remaining: ${authors.length}`);
                                promise.resolve(performAuthorSteal(authors, added), resolve, reject);
                            });
                    } else {
                        console.log(`exists, remaining: ${authors.length}`);
                        promise.resolve(performAuthorSteal(authors, added), resolve, reject);
                    }
                });
        } else {
            resolve();
        }
    });
}

function performBookSteal(author: AuthorModel, books: BookData[], added: number): VoidResponsePromise{
    return promise.createVoidPromise((resolve, reject) => {
        if (books.length > 0){
            const book = books.pop();
            console.log(`Book: ${book.title}`);
            promise.check(libraryRepository.getBooksByAuthorAndKey(author.id, book.key), reject)
                .then((data) => {
                    if (data.length == 0){
                        //import!
                        promise.check(libraryRepository.createBook(new BookModel().fromData(uuidv4(), author.id, undefined, book.key.replace('/works/', ''), book.title, book.title, 0, undefined)), reject)
                            .then(() => {
                                added = added + 1;
                                console.log(`added: ${added}, remaining: ${books.length}`);
                                promise.resolve(performBookSteal(author, books, added), resolve, reject);
                            });
                    } else {
                        console.log(`exists, remaining: ${books.length}`);
                        promise.resolve(performBookSteal(author, books, added), resolve, reject);
                    }
                });
        } else {
            resolve();
        }
    });
}

class AuthorResponse {
    numFound: number;
    docs: AuthorData[];
}
class AuthorData {
    key: string;
    name: string;
    birth_date: string;
    death_date?: string;
    work_count: number;
}

class BooksResponse {
    size: number;
    entries: BookData[];
}
class BookData {
    title: string;
    key: string;
}
