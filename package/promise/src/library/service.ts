import { Dictionary, promise, ResponseError, ResponsePromise, VoidResponsePromise } from 'mk713';
import { v4 as uuidv4 } from 'uuid';

import { AuthorModel, BookModel, GenreModel } from './models';
import { libraryRepository } from './repository';
import { accountService } from '../account/service';

export namespace libraryService {
    let genres: Dictionary<string, GenreModel>;
    let authors: Dictionary<string, AuthorModel>;
    let books: Dictionary<string, BookModel>;

    export function init() {
        libraryRepository.init();
        genres = new Dictionary<string, GenreModel>();
        authors = new Dictionary<string, AuthorModel>();
        books = new Dictionary<string, BookModel>();
    }

    export function createGenre(name: string): ResponsePromise<GenreModel>{
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryRepository.createGenre(new GenreModel().fromData(uuidv4(), name)), reject)
                .then((genre) => {
                    const toAdd = new GenreModel().fromModel(genre);
                    genres.push(toAdd.id, toAdd);
                    resolve(toAdd);    
                });
        });
    }
    export function getGenre(id: string): ResponsePromise<GenreModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            if (genres.exists(id)) {
                resolve(genres.value(id));
            } else {
                promise.check(libraryRepository.getGenre(id), reject)
                    .then((model) => {
                        const toAdd = new GenreModel().fromModel(model);
                        genres.push(toAdd.id, toAdd);
                        resolve(toAdd);
                    });
            }
        });
    }
    export function getGenres(): ResponsePromise<GenreModel[]> {
        return libraryRepository.getGenres();
    }
    export function updateGenre(id: string, name: string): ResponsePromise<GenreModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryService.getGenre(id), reject)
                .then((existing) => {
                    const toSave = new GenreModel().fromModel(existing);
                    toSave.name = name;
                    promise.check(libraryRepository.updateGenre(toSave), reject)
                        .then((saved) => {
                            genres.remove(id);
    
                            const toAdd = new GenreModel().fromModel(saved);
                            genres.push(toAdd.id, toAdd);
                            resolve(toAdd);
                        });
                });
        });
    }
    export function deleteGenre(id: string): VoidResponsePromise {
        return promise.createDelayedVoidPromise((resolve, reject) => {
            //first we need to check if any book exists with that genre
            promise.check(libraryService.getBooksbyGenre(id), reject)
                .then((data) => {
                    if (data.length > 0) {
                        reject(ResponseError.getMessageResponse(400, 'genre used for books'));
                    } else {
                        promise.resolveVoid(libraryRepository.deleteGenre(id), resolve, reject);
                    }
                });
        });
    }

    export function createAuthor(name: string, country: string, born: string): ResponsePromise<AuthorModel>{
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryRepository.createAuthor(new AuthorModel().fromData(uuidv4(), name, country, born, undefined)), reject)
                .then((author) => {
                    const toAdd = new AuthorModel().fromModel(author);
                    authors.push(toAdd.id, toAdd);
                    resolve(toAdd);    
                });
        });
    }
    export function getAuthor(id: string): ResponsePromise<AuthorModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            if (authors.exists(id)) {
                resolve(authors.value(id));
            } else {
                promise.check(libraryRepository.getAuthor(id), reject)
                    .then((author) => {
                        const toAdd = new AuthorModel().fromModel(author);
                        authors.push(toAdd.id, toAdd);
                        resolve(toAdd);                        
                    });
            }
        });
    }
    export function getAuthors(): ResponsePromise<AuthorModel[]> {
        return libraryRepository.getAuthors();
    }
    export function updateAuthor(id: string, name: string, country: string, born: string): ResponsePromise<AuthorModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryService.getAuthor(id))
                .then((author) => {
                    const toSave = new AuthorModel().fromModel(author);
                    toSave.name = name;
                    toSave.country = country;
                    toSave.born = born;
                    promise.check(libraryRepository.updateAuthor(toSave), reject)
                        .then((saved) => {
                            authors.remove(id);
    
                            const toAdd = new AuthorModel().fromModel(saved);
                            authors.push(toAdd.id, toAdd);
                            resolve(toAdd);
                        });
                });
        });
    }
    export function deleteAuthor(id: string): VoidResponsePromise {
        return promise.createDelayedPromise((resolve, reject) => {
            //first we need to check if any book exists for this author
            promise.check(libraryService.getBooksbyAuthor(id), reject)
                .then((data) => {
                    if (data.length > 0) {
                        reject(ResponseError.getMessageResponse(400, 'author used for books.'));
                    } else {
                        promise.resolveVoid(libraryRepository.deleteAuthor(id), resolve, reject);
                    }    
                });
        });
    }

    export function createBook(author_id: string, genre_id: string, title: string, original_title: string, pages_count: number, publication: string): ResponsePromise<BookModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryRepository.createBook(new BookModel().fromData(uuidv4(), author_id, genre_id, undefined, title, original_title, pages_count, publication)), reject)
                .then((data) => {
                    const toAdd = new BookModel().fromModel(data);
                    books.push(toAdd.id, toAdd);
                    resolve(toAdd);
                });
        });
    }
    export function getBook(id: string): ResponsePromise<BookModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            if (books.exists(id)) {
                resolve(books.value(id));
            } else {
                promise.check(libraryRepository.getBook(id), reject)
                    .then((data) => {
                        const toAdd = new BookModel().fromModel(data);
                        books.push(data.id, toAdd);
                        resolve(toAdd);
                    });
            }                
        });
    }
    export function getBooks(): ResponsePromise<BookModel[]> {
        return libraryRepository.getBooks();
    }
    export function getBooksbyAuthor(author_id: string): ResponsePromise<BookModel[]> {
        return libraryRepository.getBooksByAuthorAndGenre(author_id, undefined);
    }
    export function getBooksbyGenre(genre_id: string): ResponsePromise<BookModel[]> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.resolve(libraryRepository.getBooksByGenreAndPublication(genre_id, undefined), resolve, reject);
        });
    }
    export function updateBook(id: string, author_id: string, genre_id: string, title: string, original_title: string, pages_count: number, publication: string): ResponsePromise<BookModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryService.getBook(id), reject)
                .then((existing) => {
                    const toSave = new BookModel().fromData(id, author_id, genre_id, existing.ol_key, title, original_title, pages_count, publication);
                    promise.check(libraryRepository.updateBook(toSave), reject)
                        .then((saved) => {
                            books.remove(id);
    
                            const toAdd = new BookModel().fromModel(saved);
                            books.push(toAdd.id, toAdd);
                            resolve(toAdd);
                        });
                });
        });
    }
    export function deleteBook(id: string): VoidResponsePromise {
        return promise.createDelayedVoidPromise((resolve, reject) => {
            //first we need to check if this book is used in any account
            promise.check(accountService.getMyBooksByBook(id), reject)
                .then((data) => {
                    if (data.length > 0) {
                        reject(ResponseError.getMessageResponse(400, 'book exists in user\' collections.'));
                    } else {
                        promise.resolveVoid(libraryRepository.deleteBook(id), resolve, reject);
                    }
                });
        });
    }
}
