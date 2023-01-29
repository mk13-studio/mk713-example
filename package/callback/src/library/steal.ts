import { v4 as uuidv4 } from 'uuid';
import { ResponseError } from 'mk713';
import { api } from 'mk713-api';

import { AuthorModel, BookModel } from './models';
import { libraryRepository } from './repository';

export namespace libraryStealService {
    export function stealAuthor(author_name: string){
        console.log(`Author steal start: ${author_name}`);
        api.get<AuthorResponse>(`https://openlibrary.org/search/authors.json?q=${author_name}`, { }, (data) => {
            console.log(data.numFound);
            performAuthorSteal(data.docs, 0, (error) => {
                if (error){
                    console.log(error);
                } else {
                    console.log('the end');
                }
            });
        }, (error) => {
            console.log(error);
        });
    }
    export function stealBooks(author: AuthorModel){
        console.log(`Looking for books by: ${author.name}`);
        api.get<BooksResponse>(`https://openlibrary.org/authors/${author.ol_key}/works.json`, { }, (data) => {
            performBookSteal(author, data.entries, 0, (error) => {
                console.log(data.size);
                if (error){
                    console.log(error);
                }else {
                    console.log('Completed');
                }        
            });
        }, (error) => {
            console.log(error);
        });
    }
}

function performAuthorSteal(authors: AuthorData[], added: number, callback: (error?: ResponseError) => void){
    if (authors.length > 0){
        const author = authors.pop();
        console.log(`Author: ${author.name}, Works: ${author.work_count}`);
        libraryRepository.getFilteredAuthors(author.name, undefined, author.birth_date, author.key, (data, err) => {
            if (err){
                callback(ResponseError.getErrorResponse(err));
            } else {
                if (data.length == 0){
                    //import!
                    libraryRepository.createAuthor(new AuthorModel().fromData(uuidv4(), author.name, '--', author.birth_date, author.key), (_, error) => {
                        if (error){
                            callback(ResponseError.getErrorResponse(error));
                        } else {
                            added = added + 1;
                            console.log(`added: ${added}, remaining: ${authors.length}`);
                            performAuthorSteal(authors, added, (e) => {
                                callback(e);
                            });
                        }
                    });
                } else {
                    console.log(`exists, remaining: ${authors.length}`);
                    performAuthorSteal(authors, added, (e) => {
                        callback(e);
                    });
                }
            }
        });
    } else {
        callback();
    }
}

function performBookSteal(author: AuthorModel, books: BookData[], added: number, callback: (error?: ResponseError) => void){
    if (books.length > 0){
        const book = books.pop();
        console.log(`Book: ${book.title}`);
        libraryRepository.getBooksByAuthorAndKey(author.id, book.key, (data, err) => {
            if (err){
                callback(ResponseError.getErrorResponse(err));
            } else {
                if (data.length == 0){
                    //import!
                    libraryRepository.createBook(new BookModel().fromData(uuidv4(), author.id, undefined, book.key.replace('/works/', ''), book.title, book.title, 0, undefined), (_, error) => {
                        if (error){
                            callback(ResponseError.getErrorResponse(error));
                        } else {
                            added = added + 1;
                            console.log(`added: ${added}, remaining: ${books.length}`);
                            performBookSteal(author, books, added, (e) => {
                                callback(e);
                            });
                        }
                    });
                } else {
                    console.log(`exists, remaining: ${books.length}`);
                    performBookSteal(author, books, added, (e) => {
                        callback(e);
                    });
                }
            }
        });
    } else {
        callback();
    }
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
