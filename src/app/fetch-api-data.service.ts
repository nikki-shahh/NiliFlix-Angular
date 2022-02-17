import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url 
const apiUrl = 'https://niliflix.herokuapp.com/';
const token = localStorage.getItem('token');
const headers = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + token,
  }),
};


export interface User {
  _id: string;
  FavoriteMovies: Array<string>;
  Username: string;
  Email: string;
  Birthday: Date;
}

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  // handle error
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
    * Calls the user registration endpoint
    * @function userRegistration
    * @param userDetails the payload of the request
    * @returns an Observable containing a response
    */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }
  /**
    * Calls the /login endpoint
    * @function userLogin
    * @param userDetails the payload of the request
    * @returns an Observable containing a response
    */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Calls the /movies endpoint
   * @function getAllMovies
   * @returns an Observable containing a response
   */
  public getAllMovies(): Observable<any> {
    //this has type Observable
    return this.http.get(apiUrl + 'movies', headers).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
     * call API end-point to get a specific movie by Title
     * @function getMovie
     * @param Title {any}
     * @returns a movie object in json format
     */
  getMovie(Title: any): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + Title, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a director data by dirctor's name
   * @function getDirector
   * @param Name {any}
   * @returns a director's data in json format
   */
  getDirector(Name: any): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + Name, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a genre data
   * @param Name {any}
   * @returns a genre data in json format
   */
  getGenre(Name: any): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + Name, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
    * call API end-point to get a user's informations
    * @param Username {any}
    * @returns a user's information in json format
    */
  getUser(Username: any): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + Username, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
 * call API end-point to get a user's favorite movies list
 * @param Username {any}
 * @returns a list of the user's favorite movies in json format
 */
  getFavoriteMovies(Username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + Username + '/movies', headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to add a movie to the user's favorite list
   * @param MovieID {any}
   * @returns the user's favorite list in json format
   */
  addFavoriteMovie(MovieID: any): Observable<any> {
    const Username = localStorage.getItem('user');
    return this.http
      .put(apiUrl + 'users/' + Username + '/movies/' + MovieID, null, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  /**
     * call API end-point to edit the user's informations
     * @param Username {any}
     * @param userDetails {any}
     * @returns updated user's informations in json format
     */
  editUser(Username: any, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + Username, userDetails, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
     * call API end-point to delete the current user
     * @param Username {any}
     * @returns delete status
     */
  deleteUser(Username: any): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + Username, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to delete a user's favorite movie
   * @param MovieID {any}
   * @returns updated user's information after removed a movie from the list in json format
   */
  deleteFavoriteMovie(MovieID: any): Observable<any> {
    const Username = localStorage.getItem('user');
    return this.http
      .delete(apiUrl + 'users/' + Username + '/movies/' + MovieID, headers)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}