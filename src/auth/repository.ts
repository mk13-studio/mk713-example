import { RepositoryExtendedInfo, DataError } from 'mk713';
import { repository } from 'mk713-repository';
import { LoginModel } from './models';

export namespace authRepository {

    export function init() {

        repository.check(new LoginModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    ////
    //Login
    ////
    export function getLogins(callback: (data: LoginModel[], err?: Error) => void){
        repository.readArray(new LoginModel(), (dataArray, err) =>{
            callback(dataArray, err);
        });
    }
    export function getFilteredLogins(email: string, account_id: string, useAdminFilter: boolean, isAdmin: boolean, callback: (data: LoginModel[], err?: Error) => void){
        const cond = Array<RepositoryExtendedInfo>();

        if (account_id) {
            cond.push(new RepositoryExtendedInfo('account_id', account_id));
        }
        if (email) {
            cond.push(new RepositoryExtendedInfo('email', email));
        }
        if (useAdminFilter) {
            cond.push(new RepositoryExtendedInfo('admin', isAdmin));
        }

        repository.readArray(new LoginModel(), (dataArray, err) =>{
            callback(dataArray, err);
        }, cond);
    }
    export function getLogin(item_id: string, callback: (data: LoginModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new LoginModel(), item_id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function createLogin(item: LoginModel, callback: (data: LoginModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: LoginModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateLogin(item: LoginModel, callback: (data: LoginModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteLogin(item_id: string, callback: (err?: Error) => void){
        repository.removeItem(new LoginModel(), item_id, (err) =>{
            callback(err);
        });
    }
}