/**
 * Service for fetching data from the API.
 * @remarks
 * This service provides methods to interact with various endpoints of the API.
 */
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
 * Base URL of the API.
 */
const apiUrl = 'https://camflixcf-73cf2f8e0ca3.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails - User details to register.
   * @returns An Observable of the HTTP response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'register', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param credentials - User credentials for login.
   * @returns An Observable of the HTTP response.
   */
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies.
   * @returns An Observable of the HTTP response.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'movies', { headers });
  }

  /**
   * Retrieves details of a specific movie.
   * @param title - Title of the movie.
   * @returns An Observable of the HTTP response.
   */
  public getMovieDetails(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'movies/' + title, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves details of a director.
   * @param name - Name of the director.
   * @returns An Observable of the HTTP response.
   */
  public getDirector(name: string): Observable<any> {
    return this.http.get(apiUrl + 'directors/' + name).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves details of a genre.
   * @param name - Name of the genre.
   * @returns An Observable of the HTTP response.
   */
  public getGenre(name: string): Observable<any> {
    return this.http.get(apiUrl + 'genres/' + name).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves details of a user.
   * @param username - Username of the user.
   * @returns An Observable of the HTTP response.
   */
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'users/' + username, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  /**
   * Retrieves favorite movies for a user.
   * @param username - Username of the user.
   * @returns An Observable of the HTTP response.
   */
  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'users/' + username + '/favorite-movies', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to favorite movies for a user.
   * @param username - Username of the user.
   * @param movieId - ID of the movie.
   * @returns An Observable of the HTTP response.
   */
  public addMovieToFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Edits user details.
   * @param username - Username of the user.
   * @param userData - Updated user data.
   * @returns An Observable of the HTTP response.
   */
  public editUser(username: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(apiUrl + 'users/' + username, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user.
   * @param username - Username of the user.
   * @returns An Observable of the HTTP response.
   */
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(apiUrl + 'users/' + username, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from favorite movies for a user.
   * @param username - Username of the user.
   * @param movieId - ID of the movie.
   * @returns An Observable of the HTTP response.
   */
  public deleteMovieFromFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors.
   * @param error - HTTP error response.
   * @returns An observable of an empty response or throws an error.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error && error.error.text && error.error.text.includes('deleted')) {
      // This is not an error, it's a success message
      console.log('Success:', error.error.text);
      // Return an empty observable to prevent the error
      return EMPTY;
    }
  
    // Handle other errors as usual
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
