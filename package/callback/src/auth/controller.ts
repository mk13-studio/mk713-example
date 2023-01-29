import { Request } from 'express';
import { ResponseError } from 'mk713';

import { authService } from './service';

export namespace authController {

    export function initData(responseCallback: (data: {id: string}, err?: ResponseError) => void) : void {
        authService.initData(responseCallback);
    }

    export function registerUser(request: Request, responseCallback: (data: { id: string, account: string }, err?: ResponseError) => void) : void {
        if (request.body.name && request.body.email && request.body.password) {
            authService.registerUser(request.body.name, request.body.email, request.body.password, request.headers['x-requested-with'] != undefined, request.headers['x-requested-with'].toString(), responseCallback);    
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function confirmRegistration(request: Request, responseCallback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void): void {
        if (request.params.user_id && request.body.code && request.body.password) {
            authService.confirmRegistration(request.params.user_id, request.body.code, request.body.password, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function login(request: Request, responseCallback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void ) : void {
        if (request.body.login && request.body.password) {
            authService.loginUser(request.body.login, request.body.password, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function loginByToken(request: Request, responseCallback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) : void {
        if (request.params.token) {
            authService.loginByToken(request.params.loginId, request.params.token, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function forgotPassword(request: Request, responseCallback: (err?: ResponseError) => void) : void {
        if (request.body.email) {
            authService.forgotPassword(request.body.email, request.headers['x-requested-with'] != undefined, request.headers['x-requested-with'].toString(), responseCallback);
        } else {
            responseCallback(ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function recoverPassword(request: Request, responseCallback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) {
        if (request.body.recovery && request.body.email && request.body.password) {
            authService.recoverPassword(request.body.email, request.body.recovery, request.body.password, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function changePassword(request: Request, responseCallback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) : void {
        if (request.params.loginId && request.body.email && request.body.oldPassword && request.body.newPassword) {
            authService.changePassword(request.params.loginId, request.body.email, request.body.oldPassword, request.body.newPassword, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }
}
