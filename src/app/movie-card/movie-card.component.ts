/**
 * Component representing the movie card.
 * @remarks
 * This component displays movie information and handles interactions related to movies.
 */
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  /**
   * Array containing movies.
   */
  movies: any[] = [];

  /**
   * Currently logged-in user.
   */
  loggedInUser: any;

  /**
   * Array containing favorite movies.
   */
  favoriteMovies: any[] = [];

  /**
   * Constructs a new instance of MovieCardComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param dialog - Material dialog for displaying dialogs.
   * @param router - Angular router for navigation.
   * @param snackBar - Material snackbar for displaying notifications.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves movies and favorite movies for the logged-in user.
   */
  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.getMovies();
    if (this.loggedInUser) {
      this.getFavoriteMovies(); // Call getFavoriteMovies if user is logged in
    }
  }

  /**
   * Fetches all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (resp: any) => {
        this.movies = resp;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  /**
   * Retrieves favorite movies for the logged-in user from the API.
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies(this.loggedInUser.Username).subscribe(
      (response: any) => {
        this.favoriteMovies = response;
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to retrieve favorite movies', 'OK', {
          duration: 2000
        });
      }
    );
  }

  /**
   * Opens a dialog to display movie genres.
   * @param genreData - Data containing movie genres.
   */
  openGenreDialog(genreData: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '300px',
      data: genreData
    });
  }

  /**
   * Opens a dialog to display movie directors.
   * @param directorData - Data containing movie directors.
   */
  openDirectorDialog(directorData: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '300px',
      data: directorData
    });
  }

  /**
   * Opens a dialog to display movie synopsis.
   * @param movieData - Data containing movie information.
   */
  openSynopsisDialog(movieData: any): void {
    this.dialog.open(SynopsisDialogComponent, {
      width: '400px',
      data: {
        title: movieData.Title,
        description: movieData.Description
      }
    });
  }

  /**
   * Adds or removes a movie from the user's favorite list.
   * @param movie - Movie to be added or removed from favorites.
   */
  addToFavorites(movie: any): void {
    if (this.loggedInUser) {
      const index = this.favoriteMovies.findIndex((favMovie: any) => favMovie._id === movie._id);
      if (index === -1) {
        // Movie not in favorites, add it
        this.fetchApiData.addMovieToFavorites(this.loggedInUser.Username, movie._id).subscribe((resp: any) => {
          console.log('Movie added to favorites:', resp);
          this.favoriteMovies.push(movie);
          this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
        }, (error: any) => {
          console.error(error);
          this.snackBar.open('Failed to add movie to favorites', 'OK', { duration: 2000 });
        });
      } else {
        // Movie already in favorites, remove it
        const movieId = movie._id;
        this.fetchApiData.deleteMovieFromFavorites(this.loggedInUser.Username, movieId).subscribe((resp: any) => {
          console.log('Movie removed from favorites:', resp);
          this.favoriteMovies = this.favoriteMovies.filter((favMovie: any) => favMovie._id !== movieId);
          this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
        }, (error: any) => {
          console.error(error);
          this.snackBar.open('Failed to remove movie from favorites', 'OK', { duration: 2000 });
        });
      }
    } else {
      this.snackBar.open('You need to be logged in to add favorites', 'OK', { duration: 2000 });
    }
  }

  /**
   * Checks if a movie is in the user's favorite list.
   * @param movieId - ID of the movie to check.
   * @returns A boolean indicating whether the movie is a favorite or not.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }
  
  /**
   * Redirects to the details page of a movie.
   * @param movieId - ID of the movie to navigate to.
   */
  redirectToMovieDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]); // Updated navigation path
  }
}
