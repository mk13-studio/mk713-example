import { ResponseError, ResponsePromise, VoidResponsePromise, promise } from 'mk713';
import { v4 as uuidv4 } from 'uuid';

import { AccountModel, MyBookModel } from './models';
import { accountRepository } from './repository';

import { libraryService } from '../library/service';

export namespace accountService {

    export function init() {
        accountRepository.init();
    }

    export function getMyBooksByBook(book_id: string): ResponsePromise<MyBookModel[]> {
        return accountRepository.getSpecificBookForAll(book_id);
    }

    export function createAccount(account_id: string, name: string, email: string, paid: boolean): ResponsePromise<AccountModel> {
        return accountRepository.createAccount(new AccountModel().fromData(account_id, email, name, paid));
    }

    export function me(account_id: string): ResponsePromise<AccountModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(accountRepository.getAccount(account_id), reject)
                .then((data) => {
                    resolve(new AccountModel().fromModel(data));
                });
        });
    }

    export function createMyBook(account_id: string, book_id: string): ResponsePromise<MyBookModel>  {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(libraryService.getBook(book_id), reject)
                .then((book) => {
                    promise.check(libraryService.getAuthor(book.author_id), reject)
                        .then((author) => {
                            promise.check(libraryService.getGenre(book.genre_id), reject)
                                .then((genre) => {
                                    promise.check(accountRepository.createMyBook(new MyBookModel().fromData(uuidv4(), account_id, book, author, genre, false)), reject)
                                        .then((saved) => {
                                            resolve(new MyBookModel().fromModel(saved));
                                        });
                                });
                        });
                });
        });
    }
    export function getMyBooks(account_id: string): ResponsePromise<MyBookModel[]> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.resolve(accountRepository.getAccountBooks(account_id), resolve, reject);
        });
    }
    export function getMyBook(account_id: string, book_id: string): ResponsePromise<MyBookModel> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(accountRepository.getMyBook(book_id), reject)
                .then((book) => {
                    if (book.account_id == account_id) {
                        resolve(book);
                    } else {
                        reject(ResponseError.getMessageResponse(401, 'no access to book'));
                    }
                });                
        });
    }
    export function removeMyBook(account_id: string, book_id: string): VoidResponsePromise {
        return promise.createDelayedVoidPromise((resolve, reject) => {
            promise.check(accountRepository.getMyBook(book_id), reject)
                .then((book) => {
                    if (book.account_id == account_id) {
                        promise.resolveVoid(accountRepository.deleteMyBook(book_id), resolve, reject);
                    } else {
                        reject(ResponseError.getMessageResponse(401, 'no access to book'));
                    }
                });
        });
    }
}
