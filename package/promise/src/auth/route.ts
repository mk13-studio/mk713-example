import express from 'express';
import { security } from 'mk713-security';
import { server } from 'mk713-server';
import { appRoute } from '../routes';

import { authController } from './controller';
import {  } from './models';

const router = express.Router();

// auth - initial admin configuration
// no auth required
router.put(appRoute.getV1Url(appRoute.getMap().auth.init), async (_request, response) => {
    server.prepareJsonPromiseResponse(response, authController.initData());
});

// auth - register
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.register), async (request, response) => {
    server.prepareJsonPromiseResponse(response, authController.registerUser(request));
});

// auth - signup confirmation
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.confirm), async (request, response) => {
    server.prepareJsonPromiseResponse(response, authController.confirmRegistration(request));
});

// auth - login
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.login), async (request, response) => {
    server.prepareJsonPromiseResponse(response, authController.login(request));
});

// auth based on refresh token
// auth by refresh token
router.post(appRoute.getV1Url(appRoute.getMap().auth.refresh), security.validateRefreshRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response, authController.loginByToken(request));
});

// auth generate password forget request
// no authentication
router.post(appRoute.getV1Url(appRoute.getMap().auth.passForget), async (request, response) => {
    server.prepareEmptyPromiseResponse(response, authController.forgotPassword(request));
});

// auth setting password
// no authentication
router.post(appRoute.getV1Url(appRoute.getMap().auth.passSet), async (request, response) => {
    server.prepareJsonPromiseResponse(response,  authController.recoverPassword(request));
});

//auth password change
router.post(appRoute.getV1Url(appRoute.getMap().auth.passChange), security.validateAuthenticatedRequest, async (request, response) => {
    server.prepareJsonPromiseResponse(response,  authController.changePassword(request));
});

export default router;