import { RepositoryExtendedInfo, DataError, RepositoryIndexedData } from 'mk713';
import { repository } from 'mk713-repository';

import { AccountModel, MyBookModel } from './models';

export namespace accountRepository {

    export function init() {

        repository.check(new AccountModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        
        repository.checkIndexed(new MyBookModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    ////
    //Account
    ////
    export function getAccounts(callback: (data: AccountModel[], err?: Error) => void){
        repository.readArray(new AccountModel(), (dataArray, err) =>{
            callback(dataArray, err);
        });
    }
    export function getFilteredAccounts(usePaidFilter: boolean, paid: boolean, callback: (data: AccountModel[], err?: Error) => void){
        const cond = Array<RepositoryExtendedInfo>();

        if (usePaidFilter) {
            cond.push(new RepositoryExtendedInfo('paid', paid));
        }

        repository.readArray(new AccountModel(), (dataArray, err) =>{
            callback(dataArray, err);
        }, cond);
    }
    export function getAccount(id: string, callback: (data: AccountModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new AccountModel(), id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function createAccount(item: AccountModel, callback: (data: AccountModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: AccountModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateAccount(item: AccountModel, callback: (data: AccountModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteAccount(id: string, callback: (err?: Error) => void){
        repository.removeItem(new AccountModel(), id, (err) =>{
            callback(err);
        });
    }

    ////
    //MyBook
    ////
    export function getMyBook(id: string, callback: (data: MyBookModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new MyBookModel(), id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function getSpecificBook(account_id: string, book_id: string, callback: (data: MyBookModel, err?: Error) => void){
        repository.queryItem(new MyBookModel(), 0, new RepositoryIndexedData(account_id, book_id), (data, err) => {
            callback(data, err);
        });
    }
    export function getSpecificBookForAll(book_id: string, callback: (data: MyBookModel[], err?: Error) => void){
        repository.queryArray(new MyBookModel(), 3, new RepositoryIndexedData(book_id, undefined), (data, err) => {
            callback(data, err);
        });
    }
    export function getAccountBooks(account_id: string, callback: (data: MyBookModel[], err?: Error) => void){
        repository.queryArray(new MyBookModel(), 0, new RepositoryIndexedData(account_id, undefined), (data, err) => {
            callback(data, err);
        });
    }
    export function getAccountBooksByGenre(account_id: string, genre_id: string, callback: (data: MyBookModel[], err?: Error) => void){
        repository.queryArray(new MyBookModel(), 2, new RepositoryIndexedData(account_id, genre_id), (data, err) => {
            callback(data, err);
        });
    }
    export function getAccountBooksByAuthor(account_id: string, author_id: string, callback: (data: MyBookModel[], err?: Error) => void){
        repository.queryArray(new MyBookModel(), 1, new RepositoryIndexedData(account_id, author_id), (data, err) => {
            callback(data, err);
        });
    }
    export function createMyBook(item: MyBookModel, callback: (data: MyBookModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: MyBookModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateMyBook(item: MyBookModel, callback: (data: MyBookModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteMyBook(id: string, callback: (err?: Error) => void){
        repository.removeItem(new MyBookModel(), id, (err) =>{
            callback(err);
        });
    }
}