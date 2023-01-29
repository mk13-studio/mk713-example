import express from 'express';
import { security } from 'mk713-security';
import { server } from 'mk713-server';
import { appRoute } from '../routes';

import { accountController } from './controller';
import {  } from './models';

const router = express.Router();

router.get(appRoute.getV1Url(appRoute.getMap().me.account), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, accountController.me(request));
});
router.post(appRoute.getV1Url(appRoute.getMap().me.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, accountController.createMyBook(request));
});
router.get(appRoute.getV1Url(appRoute.getMap().me.books.list), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, accountController.getMyBooks(request));
});
router.get(appRoute.getV1Url(appRoute.getMap().me.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, accountController.getMyBook(request));
});
router.delete(appRoute.getV1Url(appRoute.getMap().me.books.single), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, accountController.removeMyBook(request));
});

export default router;