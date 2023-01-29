import { RepositoryExtendedObject, RepositoryExtendedInfo, RepositoryIndexedObject, RepositoryIndexedInfo } from 'mk713';

export class GenreModel implements RepositoryExtendedObject {
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('genre_name', this.name.toLowerCase()));

        return ret;
    }
    provideType(): string {
        return 'library.genres';
    }

    id: string;
    name: string;

    constructor(){
        this.id = undefined;
        this.name = undefined;
    }

    fromModel(model: GenreModel): GenreModel{
        if (model){
            this.id = model.id;
            this.name = model.name;
        }

        return this;
    }

    fromData(id: string, name: string): GenreModel{
        this.id = id;
        this.name = name;

        return this;
    }
}

export class AuthorModel implements RepositoryExtendedObject {
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('author_name', this.name.toLowerCase()));
        ret.push(new RepositoryExtendedInfo('country', this.country.toLowerCase()));
        ret.push(new RepositoryExtendedInfo('born', this.born.toLowerCase()));
        ret.push(new RepositoryExtendedInfo('ol_key', this.ol_key));

        return ret;
    }

    provideType(): string {
        return 'library.authors';
    }

    id: string;
    name: string;
    country: string;
    born: string;
    ol_key: string;

    constructor(){
        this.id = undefined;
        this.name = undefined;
        this.country = undefined;
        this.born = undefined;
        this.ol_key = undefined;
    }

    fromModel(model: AuthorModel) : AuthorModel {
        if (model) {
            this.id = model.id;
            this.name = model.name;
            this.country = model.country;
            this.born = model.born;
            this.ol_key = model.ol_key;
        }
        
        return this;
    }

    fromData(id: string, name: string, country: string, born: string, openLibrary_key: string) : AuthorModel {
        this.id = id;
        this.name = name;
        this.country = country;
        this.born = born;
        this.ol_key = openLibrary_key;

        return this;
    }

    equals(model: AuthorModel): boolean{
        return this.id == model.id;
    }

    contains(search: string): boolean {
        return this.name.toLowerCase().includes(search) || this.country.toLowerCase().includes(search) || this.born.includes(search);
    }
}

export class BookModel implements RepositoryIndexedObject {
    getIndexes(): RepositoryIndexedInfo[] {
        const ret = Array<RepositoryIndexedInfo>();

        ret.push(new RepositoryIndexedInfo('author-genre', 'author_id', 'genre_id'));
        ret.push(new RepositoryIndexedInfo('author-publication', 'author_id', 'publication'));
        ret.push(new RepositoryIndexedInfo('genre-publication', 'genre_id', 'publication'));
        ret.push(new RepositoryIndexedInfo('author-key', 'author_id', 'ol_key'));

        return ret;
    }
    getIndex(id: number): RepositoryIndexedInfo {
        return this.getIndexes()[id];
    }
    getExtended(): RepositoryExtendedInfo[] {
        const ret = Array<RepositoryExtendedInfo>();

        ret.push(new RepositoryExtendedInfo('author_id', this.author_id));
        ret.push(new RepositoryExtendedInfo('genre_id', this.genre_id));
        ret.push(new RepositoryExtendedInfo('publication', this.publication));
        ret.push(new RepositoryExtendedInfo('ol_key', this.ol_key));

        return ret;
    }

    provideType(): string {
        return 'library.books';
    }
 
    id: string;
    author_id: string;
    genre_id: string;
    ol_key: string;
    title: string;
    original_title: string;
    pages_count: number;
    publication: string;

    constructor(){
        this.id = undefined;
        this.author_id = undefined;
        this.genre_id = undefined;
        this.ol_key = undefined;
        this.title = undefined;
        this.original_title = undefined;
        this.pages_count = 0;
        this.publication = undefined;
    }

    fromModel(model: BookModel): BookModel {
        if (model){
            this.id = model.id;
            this.author_id = model.author_id;
            this.genre_id = model.genre_id;
            this.ol_key = model.ol_key;
            this.title = model.title;
            this.original_title = model.original_title;
            this.pages_count = model.pages_count;
            this.publication = model.publication;
        }

        return this;
    }
    fromData(id: string, author_id: string, genre_id: string, openLibraryKey: string, title: string, originalTitle: string, pagesCount: number, publicationDate: string): BookModel {
        this.id = id;
        this.author_id = author_id;
        this.genre_id = genre_id;
        this.ol_key = openLibraryKey;
        this.title = title;
        this.original_title = originalTitle;
        this.pages_count = pagesCount;
        this.publication = publicationDate;

        return this;
    }
}