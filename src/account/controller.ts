import { Request } from 'express';
import { ResponseError } from 'mk713';

import { AccountModel, MyBookModel } from './models';
import { accountService } from './service';

export namespace accountController {

    export function me(request: Request, responseCallback: (data: AccountModel, err?: ResponseError) => void): void {
        if (request.params.accountId) {
            accountService.me(request.params.accountId, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }

    export function createMyBook(request: Request, responseCallback: (data: MyBookModel, err?: ResponseError) => void) {
        if (request.params.accountId && request.body.book_id) {
            accountService.createMyBook(request.params.accountId, request.body.book_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }
    export function getMyBook(request: Request, responseCallback: (data: MyBookModel, err?: ResponseError) => void) {
        if (request.params.accountId && request.params.my_book_id) {
            accountService.getMyBook(request.params.accountId, request.params.my_book_id, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }        
    }
    export function getMyBooks(request: Request, responseCallback: (data: MyBookModel[], err?: ResponseError) => void) {
        if (request.params.accountId) {
            accountService.getMyBooks(request.params.accountId, responseCallback);
        } else {
            responseCallback(undefined, ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }
    export function removeMyBook(request: Request, responseCallback: (err?: ResponseError) => void) {
        if (request.params.accountId && request.params.my_book_id) {
            accountService.removeMyBook(request.params.accountId,  request.params.my_book_id, responseCallback);
        } else {
            responseCallback(ResponseError.getMessageResponse(400, 'malformed request'));
        }
    }
}
