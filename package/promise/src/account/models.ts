import { RepositoryExtendedObject, RepositoryExtendedInfo, RepositoryIndexedObject, RepositoryIndexedInfo } from 'mk713';

import { AuthorModel, BookModel, GenreModel } from '../library/models';

export class AccountModel implements RepositoryExtendedObject {
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('paid', this.paid));

        return ret;
    }

    provideType(): string {
        return 'account.main';
    }

    id: string;
    email: string;
    display: string;
    paid: boolean;
    books: number;
    authors: number;
    genres: number;
    read: number;

    constructor(){
        this.id = undefined;
        this.email = undefined;
        this.display = undefined;
        this.paid = false;
        this.books = 0;
        this.authors = 0;
        this.genres = 0;
        this.read = 0;
    }

    fromModel(model: AccountModel) : AccountModel {
        this.id = model.id;
        this.email = model.email;
        this.display = model.display;
        this.paid = model.paid;        
        this.books = model.books;
        this.authors = model.authors;
        this.genres = model.genres;
        this.read = model.read;
        
        return this;
    }

    fromData(id: string, email: string, display: string, paid: boolean) : AccountModel {
        this.id = id;
        this.email = email;
        this.display = display;
        this.paid = paid;
        this.books = 0;
        this.authors = 0;
        this.genres = 0;
        this.read = 0;

        return this;
    }
    //TODO: add book count increase
}

export class MyBookModel implements RepositoryIndexedObject {
    getIndexes(): RepositoryIndexedInfo[] {
        const ret = Array<RepositoryIndexedInfo>();

        ret.push(new RepositoryIndexedInfo('account-books', 'account_id', 'book_id'));
        ret.push(new RepositoryIndexedInfo('account-authors', 'account_id', 'author_id'));
        ret.push(new RepositoryIndexedInfo('account-genres', 'account_id', 'genre_id'));
        ret.push(new RepositoryIndexedInfo('book-id', 'book_id', 'id'));

        return ret;
    }
    getIndex(id: number): RepositoryIndexedInfo {
        return this.getIndexes()[id];
    }
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('is_read', this.read));
        ret.push(new RepositoryExtendedInfo('account_id', this.account_id));
        ret.push(new RepositoryExtendedInfo('book_id', this.book_id));
        ret.push(new RepositoryExtendedInfo('author_id', this.author_id));
        ret.push(new RepositoryExtendedInfo('genre_id', this.genre_id));

        return ret;
    }

    provideType(): string {
        return 'account.books';
    }

    id: string;
    account_id: string;
    book_id: string;
    author_id: string;
    genre_id: string;
    title: string;
    author: string;
    genre: string;
    read: boolean;

    constructor(){
        this.id = undefined;
        this.account_id = undefined;
        this.author_id = undefined;
        this.book_id = undefined;
        this.title = undefined;
        this.author = undefined;
        this.genre = undefined;
        this.read = false;
    }

    fromModel(model: MyBookModel) : MyBookModel {
        this.id = model.id;
        this.account_id = model.account_id;
        this.author_id = model.author_id;
        this.book_id = model.book_id;
        this.title = model.title;
        this.author = model.author;
        this.genre = model.genre;
        this.read = model.read;
        
        return this;
    }

    fromData(id: string, account_id: string, book: BookModel, author: AuthorModel, genre: GenreModel, is_read: boolean) : MyBookModel {
        this.id = id;
        this.account_id = account_id;
        this.author_id = author.id;
        this.book_id = book.id;
        this.title = book.title;
        this.author = author.name;
        this.genre = genre.name;
        this.read = is_read;

        return this;
    }
}
