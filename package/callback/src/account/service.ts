import { ResponseError } from 'mk713';
import { v4 as uuidv4 } from 'uuid';

import { AccountModel, MyBookModel } from './models';
import { accountRepository } from './repository';

import { libraryService } from '../library/service';

export namespace accountService {

    export function init() {
        accountRepository.init();
    }

    export function getMyBooksByBook(book_id: string, callback: (data: MyBookModel[], err?: ResponseError) => void) {
        accountRepository.getSpecificBookForAll(book_id, (data, err) => {
            if (err) {
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(data);
            }
        });
    }

    export function createAccount(account_id: string, name: string, email: string, paid: boolean, callback: (data: AccountModel, err?: ResponseError) => void) {
        accountRepository.createAccount(new AccountModel().fromData(account_id, email, name, paid), (data, error) => {
            if (error){
                callback(undefined, ResponseError.getErrorResponse(error));
            } else {
                callback(data);
            }
        });
    }

    export function me(account_id: string, callback: (data: AccountModel, err?: ResponseError) => void){
        accountRepository.getAccount(account_id, (account, err) =>{
            if (err){
                callback(undefined, ResponseError.getReadErrorResponse(err));
            } else {
                callback(new AccountModel().fromModel(account));
            }
        });
    }

    export function createMyBook(account_id: string, book_id: string, callback: (data: MyBookModel, err?: ResponseError) => void) {
        libraryService.getBook(book_id, (book, error) => {
            if (error) {
                callback(undefined, error);
            } else {
                libraryService.getAuthor(book.author_id, (author, error) => {
                    if (error) {
                        callback(undefined, error);
                    } else {
                        libraryService.getGenre(book.genre_id, (genre, error) => {
                            if (error) {
                                callback(undefined, error);
                            } else {
                                accountRepository.createMyBook(new MyBookModel().fromData(uuidv4(), account_id, book, author, genre, false), (saved, err) => {
                                    if (err) {
                                        callback(undefined, ResponseError.getErrorResponse(err));
                                    } else {
                                        callback(new MyBookModel().fromModel(saved));
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    export function getMyBooks(account_id: string, callback: (data: MyBookModel[], err?: ResponseError) => void) {
        accountRepository.getAccountBooks(account_id, (books, err) => {
            if (err) {
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback(books);
            }
        });
    }
    export function getMyBook(account_id: string, book_id: string, callback: (data: MyBookModel, err?: ResponseError) => void) {
        accountRepository.getMyBook(book_id, (book, err) => {
            if (err) {
                callback(undefined, ResponseError.getReadErrorResponse(err));
            } else {
                if (book.account_id == account_id) {
                    callback(book);
                } else {
                    callback(undefined, ResponseError.getMessageResponse(401, 'no access to book'));
                }
            }
        });
    }
    export function removeMyBook(account_id: string, book_id: string, callback: (err?: ResponseError) => void) {
        accountRepository.getMyBook(book_id, (book, err) => {
            if (err) {
                callback(ResponseError.getReadErrorResponse(err));
            } else {
                if (book.account_id == account_id) {
                    accountRepository.deleteMyBook(book_id, (error) => {
                        callback(ResponseError.getErrorResponse(error));
                    });
                } else {
                    callback(ResponseError.getMessageResponse(401, 'no access to book'));
                }
            }
        });
    }
}
