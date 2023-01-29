import { RepositoryExtendedInfo, promise, ResponsePromise, VoidResponsePromise } from 'mk713';
import { repositoryProvider } from 'mk713-repository';
import { LoginModel } from './models';

export namespace authRepository {

    export function init() {

        promise.all([
            repositoryProvider.check(new LoginModel())
        ])
            .catch((error) => {
                console.log(error.message);
                if (error.collection) {
                    error.collection.forEach((err) => {
                        console.log(err.message);
                    });
                }
            });
    }

    ////
    //Login
    ////
    export function getLogins(): ResponsePromise<LoginModel[]>{
        return repositoryProvider.readArray(new LoginModel());
    }
    export function getFilteredLogins(email: string, account_id: string, useAdminFilter: boolean, isAdmin: boolean): ResponsePromise<LoginModel[]>{
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

        return repositoryProvider.readArray(new LoginModel(), cond);
    }
    export function getLogin(item_id: string): ResponsePromise<LoginModel>{
        return repositoryProvider.readItem(new LoginModel(), item_id);
    }
    export function createLogin(item: LoginModel): ResponsePromise<LoginModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateLogin(item: LoginModel): ResponsePromise<LoginModel>{
        return repositoryProvider.updateItemExtended(item);
    }
    export function deleteLogin(item_id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new LoginModel(), item_id);
    }
}