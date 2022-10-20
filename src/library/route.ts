import express from 'express';
import { security } from 'mk713-security';
import { server } from 'mk713-server';
import { appRoute } from '../routes';

import { libraryController } from './controller';
import {  } from './models';

const router = express.Router();

//create genre
router.post(appRoute.getV1Url(appRoute.getMap().library.genres.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.createGenre(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get genres
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.list), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getGenres((data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get genre
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getGenre(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//update genre
router.post(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.updateGenre(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//delete genre
router.delete(appRoute.getV1Url(appRoute.getMap().library.genres.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.deleteGenre(request, (err) => {
        server.prepareJsonResponse(response, undefined, err);
    });
});
//books by genre
router.get(appRoute.getV1Url(appRoute.getMap().library.genres.books), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getBooksbyGenre(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

//create author
router.post(appRoute.getV1Url(appRoute.getMap().library.authors.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.createAuthor(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get authors
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.list), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getAuthors((data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get author
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getAuthor(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//update author
router.post(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.updateAuthor(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//delete author
router.delete(appRoute.getV1Url(appRoute.getMap().library.authors.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.deleteAuthor(request, (err) => {
        server.prepareJsonResponse(response, undefined, err);
    });
});
//books by author
router.get(appRoute.getV1Url(appRoute.getMap().library.authors.books), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getBooksbyAuthor(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

//create book
router.post(appRoute.getV1Url(appRoute.getMap().library.books.list), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.createBook(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get books
router.get(appRoute.getV1Url(appRoute.getMap().library.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getBooks((data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//get book
router.get(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    libraryController.getBook(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//update book
router.post(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.updateBook(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
//delete book
router.delete(appRoute.getV1Url(appRoute.getMap().library.books.single), security.validateAuthenticatedRequest, security.validateEditorRequest, async (request, response) => {
    libraryController.deleteBook(request, (err) => {
        server.prepareJsonResponse(response, undefined, err);
    });
});

export default router;