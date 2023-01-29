import { Request } from 'express';
import { ResponsePromise, VoidResponsePromise } from 'mk713';
import { server, validator } from 'mk713-server';

import { authService } from './service';

export namespace authController {

    export function initData() : ResponsePromise<{ id: string }> {
        return authService.initData();
    }

    export function registerUser(request: Request): ResponsePromise<{ id: string, account: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.name) &&
            validator.validateString(req.body.email) &&
            validator.validateString(req.body.password);
        }, 
        authService.registerUser(request.body.name, request.body.email, request.body.password, request.headers['x-requested-with'] != undefined, request.headers['x-requested-with'].toString())
        );
    }

    export function confirmRegistration(request: Request): ResponsePromise<{ token: string, refreshToken: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.user_id) &&
            validator.validateString(req.body.code) &&
            validator.validateString(req.body.password);
        }, 
        authService.confirmRegistration(request.params.user_id, request.body.code, request.body.password)
        );
    }

    export function login(request: Request): ResponsePromise<{ token: string, refreshToken: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.login) &&
            validator.validateString(req.body.password);
        }, 
        authService.loginUser(request.body.login, request.body.password)
        );
    }

    export function loginByToken(request: Request): ResponsePromise<{ token: string, refreshToken: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.token);
        }, 
        authService.loginByToken(request.params.loginId, request.params.token)
        );
    }

    export function forgotPassword(request: Request): VoidResponsePromise {
        return server.createValidatedVoidPromise(request, (req) => {
            return validator.validateString(req.body.email) &&
            validator.validateString(req.body.code) &&
            validator.validateString(req.body.password);
        }, 
        authService.forgotPassword(request.body.email, request.headers['x-requested-with'] != undefined, request.headers['x-requested-with'].toString())
        );
    }

    export function recoverPassword(request: Request): ResponsePromise<{ token: string, refreshToken: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.recovery) &&
            validator.validateString(req.body.email) &&
            validator.validateString(req.body.password);
        }, 
        authService.recoverPassword(request.body.email, request.body.recovery, request.body.password)
        );
    }

    export function changePassword(request: Request): ResponsePromise<{ token: string, refreshToken: string }> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.body.email) &&
            validator.validateString(req.body.oldPassword) &&
            validator.validateString(req.body.newPassword);
        }, 
        authService.changePassword(request.params.loginId, request.body.email, request.body.oldPassword, request.body.newPassword)
        );
    }
}
