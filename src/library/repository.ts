import { RepositoryExtendedInfo, DataError, RepositoryIndexedData } from 'mk713';
import { repository } from 'mk713-repository';

import { GenreModel, AuthorModel, BookModel } from './models';

export namespace libraryRepository {

    export function init() {

        repository.check(new GenreModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        repository.check(new AuthorModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        repository.checkIndexed(new BookModel(), (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    ////
    //Genre
    ////
    export function getGenres(callback: (data: GenreModel[], err?: Error) => void){
        repository.readArray(new GenreModel(), (dataArray, err) =>{
            callback(dataArray, err);
        });
    }
    export function getFilteredGenres(name: string, callback: (data: GenreModel[], err?: Error) => void){
        const cond = Array<RepositoryExtendedInfo>();

        if (name) {
            cond.push(new RepositoryExtendedInfo('genre_name', name.toLowerCase()));
        }

        repository.readArray(new GenreModel(), (dataArray, err) =>{
            callback(dataArray, err);
        }, cond);
    }
    export function getGenre(id: string, callback: (data: GenreModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new GenreModel(), id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function createGenre(item: GenreModel, callback: (data: GenreModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: GenreModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateGenre(item: GenreModel, callback: (data: GenreModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteGenre(id: string, callback: (err?: Error) => void){
        repository.removeItem(new GenreModel(), id, (err) =>{
            callback(err);
        });
    }

    ////
    //Author
    ////
    export function getAuthors(callback: (data: AuthorModel[], err?: Error) => void){
        repository.readArray(new AuthorModel(), (dataArray, err) =>{
            callback(dataArray, err);
        });
    }
    export function getFilteredAuthors(name: string, country: string, born: string, openLibrary_key: string, callback: (data: AuthorModel[], err?: Error) => void){
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

        repository.readArray(new AuthorModel(), (dataArray, err) =>{
            callback(dataArray, err);
        }, cond);
    }
    export function getAuthor(id: string, callback: (data: AuthorModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new AuthorModel(), id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function createAuthor(item: AuthorModel, callback: (data: AuthorModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: AuthorModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateAuthor(item: AuthorModel, callback: (data: AuthorModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteAuthor(id: string, callback: (err?: Error) => void){
        repository.removeItem(new AuthorModel(), id, (err) =>{
            callback(err);
        });
    }

    ////
    //Book
    ////
    export function getBooks(callback: (data: BookModel[], err?: Error) => void){
        repository.readArray(new BookModel(), (dataArray, err) =>{
            callback(dataArray, err);
        });
    }
    export function getBooksByAuthorAndGenre(author_id: string, genre_id: string, callback: (data: BookModel[], err?: Error) => void){
        getIndexedBooks(0, new RepositoryIndexedData(author_id, genre_id), (data, err) => {
            callback(data, err);
        });
    }
    export function getBooksByAuthorAndPublication(author_id: string, publication: string, callback: (data: BookModel[], err?: Error) => void){
        getIndexedBooks(1, new RepositoryIndexedData(author_id, publication), (data, err) => {
            callback(data, err);
        });
    }
    export function getBooksByGenreAndPublication(genre_id: string, publication: string, callback: (data: BookModel[], err?: Error) => void){
        getIndexedBooks(2, new RepositoryIndexedData(genre_id, genre_id), (data, err) => {
            callback(data, err);
        });
    }
    export function getBooksByAuthorAndKey(author_id: string, openLibraryKey: string, callback: (data: BookModel[], err?: Error) => void){
        getIndexedBooks(3, new RepositoryIndexedData(author_id, openLibraryKey), (data, err) => {
            callback(data, err);
        });
    }
    export function getBook(id: string, callback: (data: BookModel, err?: { general: Error, data: DataError }) => void){
        repository.readItem(new BookModel(), id, (dataItem, err) =>{
            callback(dataItem, err);
        });
    }
    export function createBook(item: BookModel, callback: (data: BookModel, err?: Error) => void){
        repository.createItemExtended(item, (dataItem: BookModel, err) =>{
            callback(dataItem, err);
        });
    }
    export function updateBook(item: BookModel, callback: (data: BookModel, err?: Error) => void){
        repository.updateItemExtended(item, (dataUpdated, err) =>{
            callback(dataUpdated, err);
        });
    }
    export function deleteBook(id: string, callback: (err?: Error) => void){
        repository.removeItem(new BookModel(), id, (err) =>{
            callback(err);
        });
    }
}

function getIndexedBooks(indexId: number, indexData: RepositoryIndexedData, callback: (data: BookModel[], err?: Error) => void){
    const cond = Array<RepositoryExtendedInfo>();

    repository.queryArray(new BookModel(), indexId, indexData, (data, err) => {
        callback(data, err);
    }, cond);
}
