import { Dictionary, ResponseError } from 'mk713';
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

    export function createGenre(name: string, callback: (data: GenreModel, err?: ResponseError) => void){
        libraryRepository.createGenre(new GenreModel().fromData(uuidv4(), name), (data, error) => {
            if (error){
                callback(undefined, ResponseError.getErrorResponse(error));
            } else {
                const toAdd = new GenreModel().fromModel(data);
                genres.push(toAdd.id, toAdd);
                callback(toAdd);
            }
        });    
    }
    export function getGenre(id: string, callback: (data: GenreModel, err?: ResponseError) => void) {
        if (genres.exists(id)) {
            callback(genres.value(id));
        } else {
            libraryRepository.getGenre(id, (data, err) => {
                if (err){
                    callback(undefined, ResponseError.getReadErrorResponse(err));
                } else {
                    const toAdd = new GenreModel().fromModel(data);
                    genres.push(toAdd.id, toAdd);
                    callback(toAdd);
                }
            });    
        }
    }
    export function getGenres(callback: (data: GenreModel[], err?: ResponseError) => void) {
        libraryRepository.getGenres((data, err) => {
            if (err){
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }
    export function updateGenre(id: string, name: string, callback: (data: GenreModel, err?: ResponseError) => void) {
        libraryService.getGenre(id, (existing, err) => {
            if (err) {
                callback(undefined, err);
            } else {
                const toSave = new GenreModel().fromModel(existing);
                toSave.name = name;
                libraryRepository.updateGenre(toSave, (saved, error) => {
                    if (error) {
                        callback(undefined, ResponseError.getErrorResponse(error));
                    } else {
                        genres.remove(id);

                        const toAdd = new GenreModel().fromModel(saved);
                        genres.push(toAdd.id, toAdd);
                        callback(toAdd);
                    }
                });
            }
        });
    }
    export function deleteGenre(id: string, callback: (err?: ResponseError) => void) {
        //first we need to check if any book exists with that genre
        libraryService.getBooksbyGenre(id, (data, err) => {
            if (err) {
                callback(err);
            } else {
                if (data.length > 0) {
                    callback(ResponseError.getMessageResponse(400, 'genre used for books.'));
                } else {
                    libraryRepository.deleteGenre(id, (error) => {
                        if (error) {
                            callback(ResponseError.getErrorResponse(error));
                        } else {
                            callback();
                        }
                    });
                }
            }
        });
    }

    export function createAuthor(name: string, country: string, born: string, callback: (data: AuthorModel, err?: ResponseError) => void){
        libraryRepository.createAuthor(new AuthorModel().fromData(uuidv4(), name, country, born, undefined), (data, error) => {
            if (error){
                callback(undefined, ResponseError.getErrorResponse(error));
            } else {
                const toAdd = new AuthorModel().fromModel(data);
                authors.push(toAdd.id, toAdd);
                callback(toAdd);
            }
        });    
    }
    export function getAuthor(id: string, callback: (data: AuthorModel, err?: ResponseError) => void) {
        if (authors.exists(id)) {
            callback(authors.value(id));
        } else {
            libraryRepository.getAuthor(id, (data, err) => {
                if (err){
                    callback(undefined, ResponseError.getReadErrorResponse(err));
                } else {
                    const toAdd = new AuthorModel().fromModel(data);
                    authors.push(toAdd.id, toAdd);
                    callback(toAdd);
                }
            });    
        }
    }
    export function getAuthors(callback: (data: AuthorModel[], err?: ResponseError) => void) {
        libraryRepository.getAuthors((data, err) => {
            if (err){
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }
    export function updateAuthor(id: string, name: string, country: string, born: string, callback: (data: AuthorModel, err?: ResponseError) => void) {
        libraryService.getAuthor(id, (existing, err) => {
            if (err) {
                callback(undefined, err);
            } else {
                const toSave = new AuthorModel().fromModel(existing);
                toSave.name = name;
                toSave.country = country;
                toSave.born = born;
                libraryRepository.updateAuthor(toSave, (saved, error) => {
                    if (error) {
                        callback(undefined, ResponseError.getErrorResponse(error));
                    } else {
                        authors.remove(id);

                        const toAdd = new AuthorModel().fromModel(saved);
                        authors.push(toAdd.id, toAdd);
                        callback(toAdd);
                    }
                });
            }
        });
    }
    export function deleteAuthor(id: string, callback: (err?: ResponseError) => void) {
        //first we need to check if any book exists for this author
        libraryService.getBooksbyAuthor(id, (data, err) => {
            if (err) {
                callback(err);
            } else {
                if (data.length > 0) {
                    callback(ResponseError.getMessageResponse(400, 'author used for books.'));
                } else {
                    libraryRepository.deleteAuthor(id, (error) => {
                        if (error) {
                            callback(ResponseError.getErrorResponse(error));
                        } else {
                            callback();
                        }
                    });
                }
            }
        });
    }

    export function createBook(author_id: string, genre_id: string, title: string, original_title: string, pages_count: number, publication: string, callback: (data: BookModel, err?: ResponseError) => void){
        libraryRepository.createBook(new BookModel().fromData(uuidv4(), author_id, genre_id, undefined, title, original_title, pages_count, publication), (data, error) => {
            if (error){
                callback(undefined, ResponseError.getErrorResponse(error));
            } else {
                const toAdd = new BookModel().fromModel(data);
                books.push(toAdd.id, toAdd);
                callback(toAdd);
            }
        });    
    }
    export function getBook(id: string, callback: (data: BookModel, err?: ResponseError) => void) {
        if (books.exists(id)) {
            callback(books.value(id));
        } else {
            libraryRepository.getBook(id, (data, err) => {
                if (err){
                    callback(undefined, ResponseError.getReadErrorResponse(err));
                } else {
                    const toAdd = new BookModel().fromModel(data);
                    books.push(data.id, toAdd);
                    callback(toAdd);
                }
            });    
        }
    }
    export function getBooks(callback: (data: BookModel[], err?: ResponseError) => void) {
        libraryRepository.getBooks((data, err) => {
            if (err){
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }
    export function getBooksbyAuthor(author_id: string, callback: (data: BookModel[], err?: ResponseError) => void) {
        libraryRepository.getBooksByAuthorAndGenre(author_id, undefined, (data, err) => {
            if (err){
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }
    export function getBooksbyGenre(genre_id: string, callback: (data: BookModel[], err?: ResponseError) => void) {
        libraryRepository.getBooksByGenreAndPublication(genre_id, undefined, (data, err) => {
            if (err){
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }
    export function updateBook(id: string, author_id: string, genre_id: string, title: string, original_title: string, pages_count: number, publication: string, callback: (data: BookModel, err?: ResponseError) => void) {
        libraryService.getBook(id, (existing, err) => {
            if (err) {
                callback(undefined, err);
            } else {
                const toSave = new BookModel().fromData(id, author_id, genre_id, existing.ol_key, title, original_title, pages_count, publication);
                libraryRepository.updateBook(toSave, (saved, error) => {
                    if (error) {
                        callback(undefined, ResponseError.getErrorResponse(error));
                    } else {
                        books.remove(id);

                        const toAdd = new BookModel().fromModel(saved);
                        books.push(toAdd.id, toAdd);
                        callback(toAdd);
                    }
                });
            }
        });
    }
    export function deleteBook(id: string, callback: (err?: ResponseError) => void) {
        //first we need to check if this book is used in any account
        accountService.getMyBooksByBook(id, (data, err) => {
            if (err) {
                callback(err);
            } else {
                if (data.length > 0) {
                    callback(ResponseError.getMessageResponse(400, 'book exists in user\' collections.'));
                } else {
                    libraryRepository.deleteBook(id, (error) => {
                        if (error) {
                            callback(ResponseError.getErrorResponse(error));
                        } else {
                            callback();
                        }
                    });
                }
            }
        });
    }
}
