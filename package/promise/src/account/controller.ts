import { Request } from 'express';
import { ResponsePromise, VoidResponsePromise } from 'mk713';
import { server, validator } from 'mk713-server';

import { AccountModel, MyBookModel } from './models';
import { accountService } from './service';

export namespace accountController {

    export function me(request: Request): ResponsePromise<AccountModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.accountId);
        }, accountService.me(request.params.accountId));
    }

    export function createMyBook(request: Request): ResponsePromise<MyBookModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.accountId) &&
            validator.validateString(req.body.book_id);
        }, accountService.createMyBook(request.params.accountId, request.body.book_id));
    }
    export function getMyBook(request: Request): ResponsePromise<MyBookModel> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.accountId) &&
            validator.validateString(req.params.my_book_id);
        }, accountService.getMyBook(request.params.accountId, request.params.my_book_id));
    }
    export function getMyBooks(request: Request): ResponsePromise<MyBookModel[]> {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.accountId);
        }, accountService.getMyBooks(request.params.accountId));
    }
    export function removeMyBook(request: Request): VoidResponsePromise {
        return server.createValidatedPromise(request, (req) => {
            return validator.validateString(req.params.accountId) &&
            validator.validateString(req.params.my_book_id);
        }, accountService.removeMyBook(request.params.accountId, request.params.my_book_id));
    }
}
