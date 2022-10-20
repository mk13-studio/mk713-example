export namespace appRoute {
    export function getMap() {
        return {
            general: {
                status:                     'status'
            },
            auth: {
                init:                       'auth/init',
                register:                   'auth/register',
                confirm:                    'auth/confirm/:user_id',
                login:                      'auth/login',
                refresh:                    'auth/refresh',
                passForget:                 'auth/forget',
                passSet:                    'auth/recover',
                passChange:                 'auth/password'
            },
            me: {
                account:                    'me',
                books: {
                    list:                   'me/books',
                    single:                 'me/books/:my_book_id',
                }
            },
            library: {
                genres: {
                    list:                   'library/genres',
                    search:                 'library/genres/search',
                    single:                 'library/genres/:genre_id',
                    books:                  'library/genres/:genre_id/books',
                },
                authors: {
                    list:                   'library/authors',
                    search:                 'library/authors/search',
                    single:                 'library/authors/:author_id',
                    books:                  'library/authors/:author_id/books'
                },
                books:{
                    list:                   'library/books',
                    search:                 'library/books/search',
                    single:                 'library/books/:book_id',
                }
            },
            admin: {
                accounts: {
                    list:                   'admin/accounts',
                    single:                 'admin/accounts/:account_id'
                },
                stealAuthor:                'admin/steal/authors',
                stealBooks:                 'admin/steal/authors/:author_id/books'
            }
        };
    }
    
    export enum appVersion {
        // eslint-disable-next-line no-unused-vars
        v1
    }

    export function getVersionUrl(version: appVersion, url: string): string {
        switch (version) {
        case appVersion.v1:
            return `/api/v1/${url}`;
        
        default:
            return getVersionUrl(appVersion.v1, url);
        }
    }
    export function getV1Url(url: string): string {
        return getVersionUrl(appVersion.v1, url);
    }
}
