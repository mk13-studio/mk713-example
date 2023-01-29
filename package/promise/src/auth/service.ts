import { v4 as uuidv4 } from 'uuid';
import { ResponseError, emailProvider, ResponsePromise, promise, VoidResponsePromise } from 'mk713';
import { security } from 'mk713-security';

import { LoginModel } from './models';
import { authRepository } from './repository';

import { templateService } from '../shared/emailTemplate';
import { accountService } from '../account/service';

function performSendConfirmEmail(emailAddress: string, displayName: string, code: string, sendLinkInsteadOfCode: boolean, baseUrl: string): VoidResponsePromise{
    return promise.createVoidPromise((resolve, reject) => {
        let line = 'To continue, please enter below code into the verification code field!';
        if (sendLinkInsteadOfCode && baseUrl) {
            //TO DO: this method requires changes in both template and content
            line = 'To continue, please click on below link:';
        }
        promise.check(
            emailProvider.send(
                emailAddress,
                'Confirm your account',
                templateService.prepareEmailTemplate(
                    `Hello ${displayName}!`,
                    [
                        'You\'ve just created an account in MK713 API Example App.',
                        line
                    ],
                    code)
            ), reject)
            .then(() => {
                resolve();
            });
    });
}

function registerLogin(display: string, email: string, password: string, admin: boolean, editor: boolean, account: string, sendLinkInsteadOfCode: boolean, baseUrl: string): ResponsePromise<{ id: string }>{
    return promise.createPromise((resolve, reject) => {
        //we need to find out if email is not used
        promise.check(searchLogin(email, true), reject)
            .then((value) => {
                if (value.found){
                    reject(ResponseError.getMessageResponse(409, 'email already registered'));
                } else {
                    if (display && email) {
                        //let's create actual user data
                        promise.check(authRepository.createLogin(new LoginModel().fromData(uuidv4(), email, display, password, uuidv4().substring(0, 6).toUpperCase(), admin, editor, account)), reject)
                            .then((dataItem) => {
                                //and send the code to confirm
                                performSendConfirmEmail(email, display, dataItem.code, sendLinkInsteadOfCode, baseUrl)
                                    .then(() => 
                                    {
                                        resolve({ id: dataItem.id });
                                    })
                                    .catch((error) => {
                                        console.error(error.message);
                                        //we need to remove inproper data
                                        authRepository.deleteLogin(dataItem.id)
                                            .then(() => {
                                                reject(error);
                                            })
                                            .catch((delError) => {
                                                console.error(delError.message);
                                                reject(ResponseError.getCollectionResponse([ error, delError ]));
                                            });
                                    });
                            });
                    } else {
                        reject(ResponseError.getMessageResponse(400, 'data is not valid'));
                    }
                }
            });
    });
}

function searchLogin(login_name: string, includeNotConfirmed: boolean): ResponsePromise<{ found: boolean, login?: LoginModel }> {
    return promise.createPromise((resolve, reject) => {
        promise.check(authRepository.getFilteredLogins(login_name, undefined, false, undefined), reject)
            .then((data) => {
                if (data && data.length === 1) {
                    const login = data[0];
                    if (login.confirmed || includeNotConfirmed) {
                        resolve({ found: true, login: new LoginModel().fromLoginModel(login)});
                    } else {
                        resolve({ found: false });
                    }
                } else {
                    resolve({ found: false });
                }
            });
    });
}

function generateAuthenticationTokens(login: LoginModel): ResponsePromise<{ token: string, refreshToken: string }>{
    return promise.createPromise((resolve, reject) => {
        let token = uuidv4();
        if (login.refreshToken){
            token = login.refreshToken;        
        }
        
        const refresh = security.generateSpecificToken(security.getRefreshTokenPayload(login.id, token), '30d');
        const jwt = security.generateSpecificToken(security.getRegularTokenPayload(login.id, login.accountId, login.admin, login.editor), '1d');
    
        if (login.refreshToken != token) {
            login.refreshToken = token;
    
            promise.check(authRepository.updateLogin(login), reject)
                .then(() => {
                    resolve({ token: jwt, refreshToken: refresh});
                });
        } else {
            resolve({ token: jwt, refreshToken: refresh});
        }
    });
}

export namespace authService {

    export function init() {
        authRepository.init();
    }

    export function me(login_id: string): ResponsePromise<{ email: string, name: string, id: string, admin: boolean, editor: boolean }> {
        return promise.createPromise((resolve, reject) => {
            promise.check(authRepository.getLogin(login_id), reject)
                .then((data) => {
                    if (!data) {
                        reject(ResponseError.getMessageResponse(404, 'user not found'));
                    } else { 
                        //TODO: confirm validity of below check and the process flow
                        if (data.admin){
                            resolve({ email: data.email, name: data.display, id: data.id, admin: data.admin, editor: data.editor });
                        } else {
                            reject(ResponseError.getMessageResponse(400, 'incorrect data'));
                        }
                    }
                });
        });
    }

    export function initData(): ResponsePromise<{ id: string }> {
        return promise.createPromise((resolve, reject) => {
            promise.check(authRepository.getLogins(), reject)
                .then((logins) => {
                    if (logins.length === 0) {
                        promise.resolve(registerLogin('Anonymous User', 'contact@mk13.studio', 'pass1234', true, true, undefined, false, undefined), resolve, reject);
                    } else {
                        resolve(undefined);
                    }
                });
        });
    }

    export function registerUser(name: string, emailAddress: string, password: string, sendLinkInsteadOfCode: boolean, baseUrl: string): ResponsePromise<{ id: string, account: string }> {
        return promise.createDelayedPromise((resolve, reject) => {
            const accountId = uuidv4();
            emailAddress = emailAddress.toLowerCase();
            promise.check(registerLogin(name, emailAddress, password, false, false, accountId, sendLinkInsteadOfCode, baseUrl), reject)
                .then((data) => {
                    promise.check(accountService.createAccount(accountId, name, emailAddress, false), reject)
                        .then((account) => {
                            resolve({ id: data.id, account: account.id });
                        });
                });
        });
    }

    export function confirmRegistration(login_id: string, code: string, password: string): ResponsePromise<{ token: string, refreshToken: string }>{
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(authRepository.getLogin(login_id), reject)
                .then((model) => {
                    if (model.confirmed) {
                        reject(ResponseError.getMessageResponse(404, 'login already confirmed'));
                    } else {
                        const login = new LoginModel().fromLoginModel(model);
                        if (login.checkConfirmed(code, password)){
                            promise.resolve(generateAuthenticationTokens(login), resolve, reject);
                        } else{
                            reject(ResponseError.getMessageResponse(404, 'incorrect confirmation data'));
                        }
                    }
                });
        });
    }

    export function loginUser(name: string, password: string): ResponsePromise<{ token: string, refreshToken: string }> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(searchLogin(name.toLowerCase(), false), reject)
                .then((value) => {
                    if (!value.found || !value.login) {
                        reject(ResponseError.getMessageResponse(400, 'email or password is not correct'));
                    } else {
                        if (value.login.checkPassword(password)) {
                            promise.resolve(generateAuthenticationTokens(value.login), resolve, reject);
                        } else {
                            reject(ResponseError.getMessageResponse(400, 'user or password is not correct'));
                        }    
                    }
                });
        });    
    }

    export function loginByToken(login_id: string, token: string): ResponsePromise<{ token: string, refreshToken: string }> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(authRepository.getLogin(login_id), reject)
                .then((login) => {
                    if (login.confirmed && login.refreshToken == token) {
                        promise.resolve(generateAuthenticationTokens(new LoginModel().fromLoginModel(login)), resolve, reject);
                    } else {
                        reject(ResponseError.getMessageResponse(403, 'incorrect token'));
                    }    
                });
        });    
    }

    export function forgotPassword(emailAddress: string, sendLinkInsteadOfCode: boolean, baseUrl: string): VoidResponsePromise {
        return promise.createDelayedPromise((resolve, reject) => {
            //find user
            promise.check(searchLogin(emailAddress, false), reject)
                .then((value) => {
                    if (!value.found) {
                        reject(ResponseError.getMessageResponse(404, 'user not found'));
                    } else {
                        //create recovery code
                        value.login.recovery = uuidv4().substring(0, 8).toUpperCase();
                        promise.check(authRepository.updateLogin(new LoginModel().fromLoginModel(value.login)), reject)
                            .then(() => {
                                //now, send code to user
                                //TODO: properly implement link send
                                let line = 'To reset your password, enter below code into reset code field.';
                                if (sendLinkInsteadOfCode && baseUrl) {
                                    //TO DO: this method requires changes in both template and content
                                    line = 'To reset your password, please click on below link:';
                                }
                                promise.resolveVoid(
                                    emailProvider.send(
                                        emailAddress,
                                        'Reset your password',
                                        templateService.prepareEmailTemplate(
                                            'Password reset',
                                            [
                                                line,
                                                'If you didn\'t requested password reset, you can safely ignore this email.'
                                            ],
                                            value.login.recovery
                                        )
                                    ), resolve, reject);
                            });
                    }
                });
        });
    }

    export function recoverPassword(emailAddress: string, recovery: string, password: string): ResponsePromise<{ token: string, refreshToken: string }> {
        return promise.createDelayedPromise((resolve, reject) => {
            promise.check(searchLogin(emailAddress.toLowerCase(), false), reject)
                .then((value) => {
                    if (!value.found || !value.login) {
                        reject(ResponseError.getMessageResponse(404, 'user not found'));
                    } else {
                        if (value.login.checkRecovery(recovery, password)) {
                            promise.resolve(generateAuthenticationTokens(value.login), resolve, reject);
                        } else {
                            reject(ResponseError.getMessageResponse(400, 'recovery code is not correct'));
                        }    
                    }
                });
        });    
    }

    export function changePassword(login_id: string, emailAddress: string, oldPassword: string, newPassword: string): ResponsePromise<{ token: string, refreshToken: string }> {
        return promise.createDelayedPromise((resolve, reject) => {
            //get login
            promise.check(authRepository.getLogin(login_id), reject)
                .then((model) => {
                    if (model.email === emailAddress) {
                        const login = new LoginModel().fromLoginModel(model);
                        //check & change password
                        if (!login.changePassword(oldPassword, newPassword)) {
                            reject(ResponseError.getMessageResponse(406, 'incorrect password'));
                        } else {
                            promise.check(generateAuthenticationTokens(login), reject)
                                .then((tokens) => {
                                    promise.check(
                                        emailProvider.send(
                                            emailAddress,
                                            'Password changed',
                                            templateService.prepareEmailTemplate(
                                                'Password change',
                                                [
                                                    'Your password was succesfully changed.'
                                                ]
                                            )
                                        ), reject)
                                        .then(() => {
                                            resolve(tokens);
                                        });
                                });
                        }
                    } else {
                        reject(ResponseError.getMessageResponse(403, 'incorrect email'));
                    }
                });
        });
    }

    export function getAdminEmails(): ResponsePromise<string[]> {
        return promise.createPromise((resolve, reject) => {
            promise.check(authRepository.getFilteredLogins(undefined, undefined, true, true), reject)
                .then((logins) => {
                    const emails = new Array<string>();
                    logins.forEach((login) => {
                        emails.push(login.email);
                    });
                    resolve(emails);    
                });
        });
    }
}
