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

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
    // Add logic to add movie to favorites
  }
}
