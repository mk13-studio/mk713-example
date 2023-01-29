import express from 'express';
import { security } from 'mk713-security';
import { server } from 'mk713-server';
import { appRoute } from '../routes';

import { accountController } from './controller';
import {  } from './models';

const router = express.Router();

router.get(appRoute.getV1Url(appRoute.getMap().me.account), security.validateAuthenticatedRequest, async (request, response) => {
    accountController.me(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
router.post(appRoute.getV1Url(appRoute.getMap().me.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    accountController.createMyBook(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
router.get(appRoute.getV1Url(appRoute.getMap().me.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    accountController.getMyBooks(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
router.get(appRoute.getV1Url(appRoute.getMap().me.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    accountController.getMyBook(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});
router.delete(appRoute.getV1Url(appRoute.getMap().me.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    accountController.removeMyBook(request, (err) => {
        server.prepareJsonResponse(response, undefined, err);
    });
});

export default router;