import { RepositoryExtendedInfo, RepositoryIndexedData, promise, ResponsePromise, VoidResponsePromise } from 'mk713';
import { repositoryProvider } from 'mk713-repository';

import { GenreModel, AuthorModel, BookModel } from './models';

export namespace libraryRepository {

    export function init() {

        promise.all([
            repositoryProvider.check(new GenreModel()), 
            repositoryProvider.check(new AuthorModel()),
            repositoryProvider.checkIndexed(new BookModel())
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
    //Genre
    ////
    export function getGenres(): ResponsePromise<GenreModel[]>{
        return repositoryProvider.readArray(new GenreModel());
    }
    export function getFilteredGenres(name: string): ResponsePromise<GenreModel[]>{
        const cond = Array<RepositoryExtendedInfo>();

        if (name) {
            cond.push(new RepositoryExtendedInfo('genre_name', name.toLowerCase()));
        }

        return repositoryProvider.readArray(new GenreModel(), cond);
    }
    export function getGenre(id: string): ResponsePromise<GenreModel>{
        return repositoryProvider.readItem(new GenreModel(), id);
    }
    export function createGenre(item: GenreModel): ResponsePromise<GenreModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateGenre(item: GenreModel): ResponsePromise<GenreModel>{
        return repositoryProvider.updateItemExtended(item, );
    }
    export function deleteGenre(id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new GenreModel(), id);
    }

    ////
    //Author
    ////
    export function getAuthors(): ResponsePromise<AuthorModel[]>{
        return repositoryProvider.readArray(new AuthorModel());
    }
    export function getFilteredAuthors(name: string, country: string, born: string, openLibrary_key: string): ResponsePromise<AuthorModel[]>{
        const cond = Array<RepositoryExtendedInfo>();

        if (name) {
            cond.push(new RepositoryExtendedInfo('author_name', name.toLowerCase()));
        }
        if (country) {
            cond.push(new RepositoryExtendedInfo('country', name.toLowerCase()));
        }
        if (born) {
            cond.push(new RepositoryExtendedInfo('born', born.toLowerCase()));
        }
        if (openLibrary_key) {
            cond.push(new RepositoryExtendedInfo('olKey', openLibrary_key));
        }

        return repositoryProvider.readArray(new AuthorModel(), cond);
    }
    export function getAuthor(id: string): ResponsePromise<AuthorModel>{
        return repositoryProvider.readItem(new AuthorModel(), id);
    }
    export function createAuthor(item: AuthorModel): ResponsePromise<AuthorModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateAuthor(item: AuthorModel): ResponsePromise<AuthorModel>{
        return repositoryProvider.updateItemExtended(item);
    }
    export function deleteAuthor(id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new AuthorModel(), id);
    }

    ////
    //Book
    ////
    export function getBooks(): ResponsePromise<BookModel[]>{
        return repositoryProvider.readArray(new BookModel());
    }
    export function getBooksByAuthorAndGenre(author_id: string, genre_id: string): ResponsePromise<BookModel[]>{
        return getIndexedBooksPromise(0, new RepositoryIndexedData(author_id, genre_id));
    }
    export function getBooksByAuthorAndPublication(author_id: string, publication: string): ResponsePromise<BookModel[]>{
        return getIndexedBooksPromise(1, new RepositoryIndexedData(author_id, publication));
    }
    export function getBooksByGenreAndPublication(genre_id: string, _publication: string): ResponsePromise<BookModel[]> {
        return getIndexedBooksPromise(2, new RepositoryIndexedData(genre_id, genre_id));
    }
    export function getBooksByAuthorAndKey(author_id: string, openLibraryKey: string): ResponsePromise<BookModel[]>{
        return getIndexedBooksPromise(3, new RepositoryIndexedData(author_id, openLibraryKey));
    }
    export function getBook(id: string): ResponsePromise<BookModel>{
        return repositoryProvider.readItem(new BookModel(), id);
    }
    export function createBook(item: BookModel): ResponsePromise<BookModel>{
        return repositoryProvider.createItemExtended(item);
    }
    export function updateBook(item: BookModel): ResponsePromise<BookModel>{
        return repositoryProvider.updateItemExtended(item);
    }
    export function deleteBook(id: string): VoidResponsePromise{
        return repositoryProvider.removeItem(new BookModel(), id);
    }
}

function getIndexedBooksPromise(indexId: number, indexData: RepositoryIndexedData): ResponsePromise<BookModel[]>{
    const cond = Array<RepositoryExtendedInfo>();
    return repositoryProvider.queryArray(new BookModel(), indexId, indexData, cond);

}
