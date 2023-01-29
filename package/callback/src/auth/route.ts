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
    authController.initData((data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

// auth - register
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.register), async (request, response) => {
    authController.registerUser(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

// auth - signup confirmation
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.confirm), async (request, response) => {
    authController.confirmRegistration(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

// auth - login
// no auth required
router.post(appRoute.getV1Url(appRoute.getMap().auth.login), async (request, response) => {
    authController.login(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

// auth based on refresh token
// auth by refresh token
router.post(appRoute.getV1Url(appRoute.getMap().auth.refresh), security.validateRefreshRequest, async (request, response) => {
    authController.loginByToken(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

// auth generate password forget request
// no authentication
router.post(appRoute.getV1Url(appRoute.getMap().auth.passForget), async (request, response) => {
    authController.forgotPassword(request, (err) => {
        server.prepareJsonResponse(response, undefined, err);
    });
});

// auth setting password
// no authentication
router.post(appRoute.getV1Url(appRoute.getMap().auth.passSet), async (request, response) => {
    authController.recoverPassword(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

//auth password change
router.post(appRoute.getV1Url(appRoute.getMap().auth.passChange), security.validateAuthenticatedRequest, async (request, response) => {
    authController.changePassword(request, (data, err) => {
        server.prepareJsonResponse(response, data, err);
    });
});

export default router;