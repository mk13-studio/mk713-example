import { RepositoryExtendedInfo, RepositoryIndexedData, ResponsePromise, promise, VoidResponsePromise } from 'mk713';
import { repositoryProvider } from 'mk713-repository';

import { AccountModel, MyBookModel } from './models';

export namespace accountRepository {

    export function init() {
        promise.all([
            repositoryProvider.check(new AccountModel()),
            repositoryProvider.checkIndexed(new MyBookModel())
        ])
            .catch((error) => {
                console.error(error);
                if (error.collection) {
                    error.collection.forEach((err) => {
                        console.log(err.message);
                    });
                }
            });
    }

    ////
    //Account
    ////
    export function getAccounts(): ResponsePromise<AccountModel[]>{
        return repositoryProvider.readArray(new AccountModel());
    }
    export function getFilteredAccounts(usePaidFilter: boolean, paid: boolean): ResponsePromise<AccountModel[]>{
        const cond = Array<RepositoryExtendedInfo>();

        if (usePaidFilter) {
            cond.push(new RepositoryExtendedInfo('paid', paid));
        }

        return repositoryProvider.readArray(new AccountModel(), cond);
    }
    export function getAccount(id: string): ResponsePromise<AccountModel>{
        return repositoryProvider.readItem(new AccountModel(), id);
    }
    export function createAccount(item: AccountModel): ResponsePromise<AccountModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateAccount(item: AccountModel): ResponsePromise<AccountModel>{
        return repositoryProvider.updateItemExtended(item);
    }
    export function deleteAccount(id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new AccountModel(), id);
    }

    ////
    //MyBook
    ////
    export function getMyBook(id: string): ResponsePromise<MyBookModel>{
        return repositoryProvider.readItem(new MyBookModel(), id);
    }
    export function getSpecificBook(account_id: string, book_id: string): ResponsePromise<MyBookModel>{
        return repositoryProvider.queryItem(new MyBookModel(), 0, new RepositoryIndexedData(account_id, book_id));
    }
    export function getSpecificBookForAll(book_id: string): ResponsePromise<MyBookModel[]> {
        return repositoryProvider.queryArray(new MyBookModel(), 3, new RepositoryIndexedData(book_id, undefined));
    }
    export function getAccountBooks(account_id: string): ResponsePromise<MyBookModel[]>{
        return repositoryProvider.queryArray(new MyBookModel(), 0, new RepositoryIndexedData(account_id, undefined));
    }
    export function getAccountBooksByGenre(account_id: string, genre_id: string): ResponsePromise<MyBookModel[]>{
        return repositoryProvider.queryArray(new MyBookModel(), 2, new RepositoryIndexedData(account_id, genre_id));
    }
    export function getAccountBooksByAuthor(account_id: string, author_id: string): ResponsePromise<MyBookModel[]>{
        return repositoryProvider.queryArray(new MyBookModel(), 1, new RepositoryIndexedData(account_id, author_id));
    }
    export function createMyBook(item: MyBookModel): ResponsePromise<MyBookModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateMyBook(item: MyBookModel): ResponsePromise<MyBookModel>{
        return repositoryProvider.updateItemExtended(item);
    }
    export function deleteMyBook(id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new MyBookModel(), id);
    }
}