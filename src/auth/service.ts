import { v4 as uuidv4 } from 'uuid';

import { ResponseError, email } from 'mk713';
import { security } from 'mk713-security';

import { LoginModel } from './models';
import { authRepository } from './repository';

import { templateService } from '../shared/emailTemplate';
import { accountService } from '../account/service';

function performSendConfirmEmail(emailAddress: string, displayName: string, code: string, sendLinkInsteadOfCode: boolean, baseUrl: string, callback: (err?: ResponseError) => void){
    let line = 'To continue, please enter below code into the verification code field!';
    if (sendLinkInsteadOfCode && baseUrl) {
        //TO DO: this method requires changes in both template and content
        line = 'To continue, please click on below link:';
    }
    email.send(
        emailAddress,
        'Confirm your account',
        templateService.prepareEmailTemplate(
            `Hello ${displayName}!`,
            [
                'You\'ve just created an account in MK713 API Example App.',
                line
            ],
            code
        ),
        (error) => {
            if (error){
                callback(ResponseError.getErrorResponse(error));
            } else {
                callback();
            }
        }
    );
}

function registerLogin(display: string, email: string, password: string, admin: boolean, editor: boolean, account: string, sendLinkInsteadOfCode: boolean, baseUrl: string, callback: (data: {id: string}, err?: ResponseError) => void){
    //we need to find out if email is not used
    searchLogin(email, true, (found) => {
        if (found){
            callback(undefined, ResponseError.getMessageResponse(409, 'email already registered'));
        } else {
            if (display && email) {
                //let's create actual user data
                authRepository.createLogin(new LoginModel().fromData(uuidv4(), email, display, password, uuidv4().substring(0, 6).toUpperCase(), admin, editor, account), (dataItem, err) =>{
                    if (err) {
                        callback(undefined, ResponseError.getErrorResponse(err));
                    } else {
                        //and send the code to confirm
                        performSendConfirmEmail(email, display, dataItem.code, sendLinkInsteadOfCode, baseUrl, (err) => {
                            if (err){
                                console.log(err);
                                //we need to remove inproper data
                                authRepository.deleteLogin(dataItem.id, (error) => {
                                    if (error){
                                        console.log(error.message);
                                    }
                                    callback(undefined, err);
                                });
                            } else {
                                callback({ id: dataItem.id });
                            }
                        });
                    }
                });
            } else {
                callback(undefined, ResponseError.getMessageResponse(400, 'data is not valid'));
            }
        }
    });
}

function searchLogin(login_name: string, includeNotConfirmed: boolean, callback: (found: boolean, login?: LoginModel) => void) {
    authRepository.getFilteredLogins(login_name, undefined, false, undefined, (data, error) => {
        if (error) {
            callback(false);
        } else if (data && data.length === 1) {
            const login = data[0];
            if (login.confirmed || includeNotConfirmed) {
                callback(true, new LoginModel().fromLoginModel(login));
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}

function generateAuthenticationTokens(login: LoginModel, callback: (tokens: { token: string, refreshToken: string }, err?: ResponseError) => void): void{
    let token = uuidv4();
    if (login.refreshToken){
        token = login.refreshToken;        
    }
    const refresh = security.generateSpecificToken({ loginId: login.id, token: token }, '30d');
    const jwt = security.generateSpecificToken({ loginId: login.id, accountId: login.accountId, admin: login.admin, editor: login.editor }, '1d');

    if (login.refreshToken != token) {
        login.refreshToken = token;

        authRepository.updateLogin(login, (_updated, err) => {
            if (err) {
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                callback({ token: jwt, refreshToken: refresh});
            }
        });    
    } else {
        callback({ token: jwt, refreshToken: refresh});
    }
}

export namespace authService {

    export function init() {
        authRepository.init();
    }

    export function me(login_id: string, callback: (data: { email: string, name: string, id: string, admin: boolean, editor: boolean }, err?: ResponseError) => void) {
        authRepository.getLogin(login_id, (data, err) => {
            if (err || !data) {
                callback(undefined, ResponseError.getReadErrorResponse(err, 'user not found'));
            } else {
                //TODO: confirm validity of below check and the process flow
                if (data.admin) {
                    callback({ email: data.email, name: data.display, id: data.id, admin: data.admin, editor: data.editor });
                } else {
                    callback(undefined, ResponseError.getMessageResponse(400, 'incorrect data'));
                }
            }
        });
    }

    export function initData(callback: (data: {id: string}, err?: ResponseError) => void) {
        authRepository.getLogins((logins, err) =>{
            if (err) {
                callback(undefined, ResponseError.getErrorResponse(err));
            } else if (logins.length === 0) {
                registerLogin('Anonymous User', 'contact@mk13.studio', 'pass1234', true, true, undefined, false, undefined, (data, error) => {
                    callback(data, error);
                });
            } else {
                callback(undefined);
            }
        });
    }

    export function registerUser(name: string, emailAddress: string, password: string, sendLinkInsteadOfCode: boolean, baseUrl: string, callback: (data: { id: string, account: string }, err?: ResponseError) => void) {
        const accountId = uuidv4();
        emailAddress = emailAddress.toLowerCase();
        registerLogin(name, emailAddress, password, false, false, accountId, sendLinkInsteadOfCode, baseUrl, (data, err) => {
            if (err) {
                callback(undefined, err);
            } else {
                accountService.createAccount(accountId, name, emailAddress, false, (account, err) => {
                    if (err) {
                        callback(undefined, err);
                    } else {
                        callback({ id: data.id, account: account.id });
                    }
                });
            }
        });
    }

    export function confirmRegistration(login_id: string, code: string, password: string, callback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void){
        authRepository.getLogin(login_id, (model, err) =>{
            if (err) {
                callback(undefined, ResponseError.getReadErrorResponse(err, 'login data not valid'));
            } else {
                if (model.confirmed) {
                    callback(undefined, ResponseError.getMessageResponse(404, 'login already confirmed'));
                } else {
                    const login = new LoginModel().fromLoginModel(model);
                    if (login.checkConfirmed(code, password)){
                        generateAuthenticationTokens(login, (tokens, err) => {
                            callback(tokens, err);
                        });
                    } else{
                        callback(undefined, ResponseError.getMessageResponse(404, 'incorrect confirmation data'));
                    }
                }
            }
        });
    }

    export function loginUser(name: string, password: string, callback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) {
        searchLogin(name.toLowerCase(), false, (found, login) => {
            if (!found) {
                callback(undefined, ResponseError.getMessageResponse(400, 'email or password is not correct'));
            } else {
                //check password
                if (login.checkPassword(password)) {
                    //generate tokens
                    generateAuthenticationTokens(login, (tokens, err) => {
                        callback(tokens, err);
                    });
                } else {
                    callback(undefined, ResponseError.getMessageResponse(400, 'user or password is not correct'));
                }
            }
        });
    }

    export function loginByToken(login_id: string, token: string, callback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) {
        authRepository.getLogin(login_id, (login, err) => {
            if (err) {
                callback(undefined, ResponseError.getReadErrorResponse(err, 'missing token', 403));
            } else {
                if (login.confirmed && login.refreshToken == token){
                    generateAuthenticationTokens(new LoginModel().fromLoginModel(login), (tokens, err) => {
                        callback(tokens, err);
                    });
                } else {
                    callback(undefined, ResponseError.getReadErrorResponse(err, 'incorrect token', 403));
                }
            }
        });
    }

    export function forgotPassword(emailAddress: string, sendLinkInsteadOfCode: boolean, baseUrl: string, callback: (err?: ResponseError) => void) {
        //find user
        searchLogin(emailAddress, false, (found, login) => {
            if (!found) {
                callback(ResponseError.getMessageResponse(404, 'user not found'));
            } else {
                //create recovery code
                login.recovery = uuidv4().substring(0, 8).toUpperCase();
                authRepository.updateLogin(login, (_updated, err) => {
                    if (err){
                        callback(ResponseError.getErrorResponse(err));
                    } else {
                        //now, send code to user
                        //TODO: properly implement link send
                        let line = 'To reset your password, enter below code into reset code field.';
                        if (sendLinkInsteadOfCode && baseUrl) {
                            //TO DO: this method requires changes in both template and content
                            line = 'To reset your password, please click on below link:';
                        }
                        email.send(
                            emailAddress,
                            'Reset your password',
                            templateService.prepareEmailTemplate(
                                'Password reset',
                                [
                                    line,
                                    'If you didn\'t requested password reset, you can safely ignore this email.'
                                ],
                                login.recovery
                            ),
                            (error) => {
                                if (error) {
                                    callback(ResponseError.getErrorResponse(error));
                                } else {
                                    callback();
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    export function recoverPassword(emailAddress: string, recovery: string, password: string, callback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) {
        //find user
        searchLogin(emailAddress, false, (found, login) => {
            if (!found) {
                callback(undefined, ResponseError.getMessageResponse(404, 'user not found'));
            } else {
                if (login.checkRecovery(recovery, password)){
                    generateAuthenticationTokens(login, (tokens, err) => {
                        callback(tokens, err);
                    });
                }
            }
        });
    }

    export function changePassword(login_id: string, emailAddress: string, oldPassword: string, newPassword: string, callback: (data: { token: string, refreshToken: string }, err?: ResponseError) => void) {
        //get login
        authRepository.getLogin(login_id, (model, err) => {
            if (err) {
                callback(undefined, ResponseError.getReadErrorResponse(err, 'user not found'));
            } else {
                if (model.email === emailAddress) {
                    const login = new LoginModel().fromLoginModel(model);
                    //check & change password
                    if (!login.changePassword(oldPassword, newPassword)) {
                        callback(undefined, ResponseError.getMessageResponse(406, 'incorrect password'));
                    } else {
                        generateAuthenticationTokens(login, (tokens, err) => {
                            if (err) {
                                callback(undefined, err);
                            } else {
                                email.send(
                                    emailAddress,
                                    'Password changed',
                                    templateService.prepareEmailTemplate(
                                        'Password change',
                                        [
                                            'Your password was succesfully changed.'
                                        ]
                                    ),
                                    (error) => {
                                        if (error) {
                                            callback(undefined, ResponseError.getErrorResponse(error));
                                        } else {
                                            callback(tokens);
                                        }
                                    }
                                );
                            }
                        });
                    }
                } else {
                    callback(undefined, ResponseError.getMessageResponse(403, 'incorrect email'));
                }
            }
        });
    }

    export function getAdminEmails(callback: (emails: string[], err?: ResponseError) => void) {
        authRepository.getFilteredLogins(undefined, undefined, true, true, (logins, err) => {
            if (err) {
                callback(undefined, ResponseError.getErrorResponse(err));
            } else {
                const emails = new Array<string>();
                logins.forEach((login) => {
                    emails.push(login.email);
                });
                callback(emails);
            }
        });
    }
}
