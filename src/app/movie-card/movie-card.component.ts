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
  movies: any[] = [];
  loggedInUser: any;
  favoriteMovies: any[] = []; // Define favoriteMovies array

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.getMovies();
    if (this.loggedInUser) {
      this.getFavoriteMovies(); // Call getFavoriteMovies if user is logged in
    }
  }

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

  openGenreDialog(genreData: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '300px',
      data: genreData
    });
  }

  openDirectorDialog(directorData: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '300px',
      data: directorData
    });
  }

  openSynopsisDialog(movieData: any): void {
    this.dialog.open(SynopsisDialogComponent, {
      width: '400px',
      data: {
        title: movieData.Title,
        description: movieData.Description
      }
    });
  }

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

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }
  
  redirectToMovieDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]); // Updated navigation path
  }
}
