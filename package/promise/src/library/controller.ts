import { Request } from 'express';
import { ResponsePromise, VoidResponsePromise } from 'mk713';
import { server, validator } from 'mk713-server';
import { AuthorModel, BookModel, GenreModel } from './models';

import { libraryService } from './service';

export namespace libraryController {

    export function createGenre(request: Request): ResponsePromise<GenreModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.name);
        }, libraryService.createGenre(request.body.name));
    }
    export function getGenres(): ResponsePromise<GenreModel[]> {
        return libraryService.getGenres();        
    }
    export function getGenre(request: Request) : ResponsePromise<GenreModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.genre_id);
        }, libraryService.getGenre(request.params.genre_id));
    }
    export function updateGenre(request: Request): ResponsePromise<GenreModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.genre_id)
                && validator.validateString(req.body.name);
        }, libraryService.updateGenre(request.params.genre_id, request.body.name));
    }
    export function deleteGenre(request: Request): VoidResponsePromise {
        return server.createValidatedVoidPromise(request, (req) => {
            return validator.validateString(req.params.genre_id);
        }, libraryService.deleteGenre(request.params.genre_id));
    }
    export function getBooksbyGenre(request: Request): ResponsePromise<BookModel[]> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.genre_id);
        }, libraryService.getBooksbyGenre(request.params.genre_id));
    }

    export function createAuthor(request: Request): ResponsePromise<AuthorModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.name) &&
                validator.validateString(req.body.country) &&
                validator.validateString(req.body.born);
        }, libraryService.createAuthor(request.body.name, request.body.country, request.body.born));
    }
    export function getAuthors(): ResponsePromise<AuthorModel[]> {
        return libraryService.getAuthors();        
    }
    export function getAuthor(request: Request): ResponsePromise<AuthorModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.author_id);
        }, libraryService.getAuthor(request.params.author_id));
    }
    export function updateAuthor(request: Request): ResponsePromise<AuthorModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.genre_id) &&
                validator.validateString(req.body.name) &&
                validator.validateString(req.body.country) &&
                validator.validateString(req.body.born);
        }, libraryService.updateAuthor(request.params.genre_id, request.body.name, request.body.country, request.body.born));
    }
    export function deleteAuthor(request: Request): VoidResponsePromise {
        return server.createValidatedVoidPromise(request, (req) => {
            return validator.validateString(req.params.author_id);
        }, libraryService.deleteAuthor(request.params.author_id));
    }

    export function getBooksbyAuthor(request: Request): ResponsePromise<BookModel[]> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.author_id);
        }, libraryService.getBooksbyAuthor(request.params.author_id));
    }

    export function createBook(request: Request): ResponsePromise<BookModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.name) &&
                validator.validateString(req.body.country) &&
                validator.validateString(req.body.born);
        }, libraryService.createBook(request.body.author_id, request.body.genre_id, request.body.title, request.body.original_title, request.body.pages_count, request.body.publication));
    }
    export function getBooks(): ResponsePromise<BookModel[]> {
        return libraryService.getBooks();
    }
    export function getBook(request: Request): ResponsePromise<BookModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.book_id);
        }, libraryService.getBook(request.params.book_id));
    }
    export function updateBook(request: Request): ResponsePromise<BookModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.book_id) &&
                validator.validateString(req.body.genre_id) &&
                validator.validateString(req.body.title) &&
                validator.validateString(req.body.original_title) &&
                validator.validateString(req.body.pages_count) &&
                validator.validateString(req.body.publication);
        }, libraryService.updateBook(request.params.book_id, request.body.author_id, request.body.genre_id, request.body.title, request.body.original_title, request.body.pages_count, request.body.publication));
    }
    export function deleteBook(request: Request): VoidResponsePromise {
        return server.createValidatedVoidPromise(request, (req) => {
            return validator.validateString(req.params.book_id);
        }, libraryService.deleteBook(request.params.book_id));
    }
}
