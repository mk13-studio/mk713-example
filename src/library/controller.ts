import { Request } from 'express';
import { ResponseError } from 'mk713';
import { AuthorModel, BookModel, GenreModel } from './models';

import { libraryService } from './service';

export namespace libraryController {

    export function createGenre(request: Request, responseCallback: (data: GenreModel, err?: ResponseError) => void) {
        if (request.body.name) {
            libraryService.createGenre(request.body.name, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function getGenres(responseCallback: (data: GenreModel[], err?: ResponseError) => void) {
        libraryService.getGenres(responseCallback);        
    }
    export function getGenre(request: Request, responseCallback: (data: GenreModel, err?: ResponseError) => void) {
        if (request.params.genre_id) {
            libraryService.getGenre(request.params.genre_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function updateGenre(request: Request, responseCallback: (data: GenreModel, err?: ResponseError) => void) {
        if (request.params.genre_id && request.body.name) {
            libraryService.updateGenre(request.params.genre_id, request.body.name, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function deleteGenre(request: Request, responseCallback: (err?: ResponseError) => void) {
        if (request.params.genre_id) {
            libraryService.deleteGenre(request.params.genre_id, responseCallback);
        } else {
            responseCallback(ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function getBooksbyGenre(request: Request, responseCallback: (data: BookModel[], err?: ResponseError) => void) {
        if (request.params.genre_id) {
            libraryService.getBooksbyGenre(request.params.genre_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }   
    }

    export function createAuthor(request: Request, responseCallback: (data: AuthorModel, err?: ResponseError) => void) {
        if (request.body.name && request.body.country && request.body.born) {
            libraryService.createAuthor(request.body.name, request.body.country, request.body.born, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function getAuthors(responseCallback: (data: AuthorModel[], err?: ResponseError) => void) {
        libraryService.getAuthors(responseCallback);        
    }
    export function getAuthor(request: Request, responseCallback: (data: AuthorModel, err?: ResponseError) => void) {
        if (request.params.author_id) {
            libraryService.getAuthor(request.params.author_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function updateAuthor(request: Request, responseCallback: (data: AuthorModel, err?: ResponseError) => void) {
        if (request.params.genre_id && request.body.name && request.body.country && request.body.born) {
            libraryService.updateAuthor(request.params.genre_id, request.body.name, request.body.country, request.body.born, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function deleteAuthor(request: Request, responseCallback: (err?: ResponseError) => void) {
        if (request.params.author_id) {
            libraryService.deleteAuthor(request.params.author_id, responseCallback);
        } else {
            responseCallback(ResponseError.getMessageResponse(400, 'malformed request'));   
        }

    }
    export function getBooksbyAuthor(request: Request, responseCallback: (data: BookModel[], err?: ResponseError) => void) {
        if (request.params.author_id) {
            libraryService.getBooksbyAuthor(request.params.author_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }   
    }

    export function createBook(request: Request, responseCallback: (data: BookModel, err?: ResponseError) => void) {
        if (request.body.author_id && request.body.genre_id && request.body.title && request.body.original_title && request.body.pages_count && request.body.publication) {
            libraryService.createBook(request.body.author_id, request.body.genre_id, request.body.title, request.body.original_title, request.body.pages_count, request.body.publication, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function getBooks(responseCallback: (data: BookModel[], err?: ResponseError) => void) {
        libraryService.getBooks(responseCallback);
    }
    export function getBook(request: Request, responseCallback: (data: BookModel, err?: ResponseError) => void) {
        if (request.params.book_id) {
            libraryService.getBook(request.params.book_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function updateBook(request: Request, responseCallback: (data: BookModel, err?: ResponseError) => void) {
        if (request.params.book_id && request.body.author_id && request.body.genre_id && request.body.title && request.body.original_title && request.body.pages_count && request.body.publication) {
            libraryService.updateBook(request.params.book_id, request.body.author_id, request.body.genre_id, request.body.title, request.body.original_title, request.body.pages_count, request.body.publication, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
    export function deleteBook(request: Request, responseCallback: (err?: ResponseError) => void) {
        if (request.params.book_id) {
            libraryService.deleteBook(request.params.book_id, responseCallback);
        } else {
            responseCallback(ResponseError.getMessageResponse(400, 'malformed request'));   
        }
    }
}
