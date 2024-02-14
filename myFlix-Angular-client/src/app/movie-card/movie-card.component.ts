import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.getMovies();
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
    const index = this.loggedInUser.FavoriteMovies.findIndex((favMovie: any) => favMovie === movie._id);
    if (index === -1) {
      // Movie not in favorites, add it
      this.fetchApiData.addMovieToFavorites(this.loggedInUser.Username, movie._id).subscribe((resp: any) => {
        console.log('Movie added to favorites:', resp);
        this.loggedInUser.FavoriteMovies.push(movie._id);
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      });
    } else {
      // Movie already in favorites, remove it
      this.fetchApiData.deleteMovieFromFavorites(this.loggedInUser.Username, movie._id).subscribe((resp: any) => {
        console.log('Movie removed from favorites:', resp);
        this.loggedInUser.FavoriteMovies.splice(index, 1);
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      });
    }
  }

  isFavorite(movieId: string): boolean {
    return this.loggedInUser.FavoriteMovies.includes(movieId);
  }
  
  
}
