import { RepositoryExtendedObject, RepositoryExtendedInfo } from 'mk713';
import { crypto } from 'mk713-crypto';

const currentPasswordLength = 1024;
const currentIterations = 32;

export class LoginModel implements RepositoryExtendedObject {
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('account_id', this.accountId));
        ret.push(new RepositoryExtendedInfo('email', this.email));
        ret.push(new RepositoryExtendedInfo('admin', this.admin));
        ret.push(new RepositoryExtendedInfo('editor', this.editor));
        return ret;
    }
    provideType(): string {
        return 'auth.login';
    }
    
    id: string;
    accountId: string;
    email: string;
    display: string;
    admin: boolean;
    editor: boolean;
    confirmed: boolean;
    code: string;
    recovery: string;
    refreshToken: string;
    password: LoginPassword;

    constructor(){
        this.id = undefined;
        this.accountId = undefined;
        this.email = undefined;
        this.display = undefined;
        this.admin = false;
        this.editor = false;
        this.confirmed = false;
        this.code = undefined;
        this.recovery = undefined;
        this.refreshToken = undefined;
        this.password = undefined;
    }

    fromLoginModel(model: LoginModel) : LoginModel {
        this.id = model.id;
        this.accountId = model.accountId;
        this.email = model.email;
        this.display = model.display;
        this.admin = model.admin;
        this.editor = model.editor;
        this.confirmed = model.confirmed;
        this.code = model.code;
        this.recovery = model.recovery;
        this.refreshToken = model.refreshToken;
        this.password = new LoginPassword().fromModel(model.password);

        return this;
    }

    fromData(id: string, email: string, display: string, base64Password: string, code: string, admin: boolean, editor: boolean, account: string) : LoginModel {
        this.id = id;
        this.accountId = account;
        this.email = email;
        this.display = display;
        this.admin = admin;
        this.editor = editor;
        this.code = code;
        this.confirmed = false;
        
        return this.setNewPassword(base64Password);
    }

    setNewPassword(base64Password: string): LoginModel {
        this.password = new LoginPassword().fromData(base64Password);
        this.recovery = undefined;
        this.refreshToken = undefined;

        return this;
    }

    changePassword(oldBase64Password: string, newBase64Password: string) : boolean{
        if (this.checkPassword(oldBase64Password)) {
            this.setNewPassword(newBase64Password);
            return true;
        } else {
            return false;
        }
    }

    checkPassword(base64password: string): boolean{
        return this.password.checkPasswordCorrectness(base64password);
    }

    checkConfirmed(code: string, base64password: string): boolean {
        if (this.code == code && this.checkPassword(base64password)){
            this.confirmed = true;
            this.code = undefined;
            this.recovery = undefined;
            this.refreshToken = undefined;
    
            return true;
        } else {
            return false;
        }
    }

    checkRecovery(recovery: string, base64password: string): boolean {
        if (this.recovery == recovery){
            this.setNewPassword(base64password);
            this.code = undefined;
            this.confirmed = true;
    
            return true;
        } else {
            return false;
        }
    }

    setRecoveryCode(recovery: string){
        this.recovery = recovery;
    }

    setRefreshToken(token: string){
        this.refreshToken = token;
    }
}

export class LoginPassword {
    hash: string;
    salt: string;
    length: number;
    iterations: number;

    constructor(){
        this.hash = undefined;
        this.salt = undefined;
        this.length = 0;
        this.iterations = 0;
    }

    fromData(base64Password: string): LoginPassword{
        this.setPassword(base64Password);

        return this;
    }

    fromModel(model: LoginPassword): LoginPassword{
        this.length = model.length;
        this.iterations = model.iterations;
        this.salt = model.salt;
        this.hash = model.hash;

        return this;
    }

    checkPasswordCorrectness(base64password: string): boolean{
        return this.hash === this.getHash(base64password);
    }

    private setPassword(base64Password: string){
        this.length = currentPasswordLength;
        this.iterations = currentIterations;

        this.salt = crypto.generateSalt(this.length);
        this.hash = this.getHash(base64Password);
    }

    private getHash(base64Password: string): string{
        return crypto.generateHash(base64Password, this.salt, this.iterations, this.length);
    }
}
