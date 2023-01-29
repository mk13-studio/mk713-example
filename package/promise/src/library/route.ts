import express from 'express';
import { security } from 'mk713-security';
import { server } from 'mk713-server';
import { appRoute } from '../routes';

import { libraryController } from './controller';

const router = express.Router();

//create genre
router.post(appRoute.getV1Url(appRoute.getMap().library.genres.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.createGenre(request));
});
//get genres
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.list), security.validateAuthenticatedRequest, async (_request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getGenres());
});
//get genre
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getGenre(request));
});
//update genre
router.post(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.updateGenre(request));
});
//delete genre
router.delete(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareEmptyPromiseResponse(response, libraryController.deleteGenre(request));
});
//books by genre
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.books), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getBooksbyGenre(request));
});

//create author
router.post(appRoute.getV1Url(appRoute.getMap().library.authors.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.createAuthor(request));
});
//get authors
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.list), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getAuthors());
});
//get author
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getAuthor(request));
});
//update author
router.post(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.updateAuthor(request));
});
//delete author
router.delete(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareEmptyPromiseResponse(response, libraryController.deleteAuthor(request));
});
//books by author
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.books), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getBooksbyAuthor(request));
});

//create book
router.post(appRoute.getV1Url(appRoute.getMap().library.books.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.createBook(request));
});
//get books
router.get(appRoute.getV1Url(appRoute.getMap().library.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getBooks());
});
//get book
router.get(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.getBook(request));
});
//update book
router.post(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, libraryController.updateBook(request));
});
//delete book
router.delete(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    server.prepareEmptyPromiseResponse(response, libraryController.deleteBook(request));
});

export default router;