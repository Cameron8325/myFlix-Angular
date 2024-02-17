import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://camflixcf-73cf2f8e0ca3.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // User registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'register', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User login endpoint
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'movies', { headers });
  }

  // Get one movie endpoint
  public getMovieDetails(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'movies/' + title, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get director endpoint
  public getDirector(name: string): Observable<any> {
    return this.http.get(apiUrl + 'directors/' + name).pipe(
      catchError(this.handleError)
    );
  }

  // Get genre endpoint
  public getGenre(name: string): Observable<any> {
    return this.http.get(apiUrl + 'genres/' + name).pipe(
      catchError(this.handleError)
    );
  }

  // Get user endpoint
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'users/' + username, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  // Get favorite movies for a user endpoint
  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + 'users/' + username + '/favorite-movies', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a movie to favorite movies endpoint
  public addMovieToFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Edit user endpoint
  public editUser(username: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(apiUrl + 'users/' + username, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user endpoint
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(apiUrl + 'users/' + username, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a movie from favorite movies endpoint
  public deleteMovieFromFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, { headers }).pipe(
      catchError(this.handleError)
    );
  }

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
