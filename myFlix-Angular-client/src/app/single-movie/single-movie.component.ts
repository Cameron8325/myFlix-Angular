import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-single-movie',
  templateUrl: './single-movie.component.html',
  styleUrls: ['./single-movie.component.scss']
})
export class SingleMovieComponent implements OnInit {
  movieId!: string;
  movieData: any;
  errorMessage: string = '';
  loggedInUser: any;
  allMovies: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
      this.getMovieDetails(this.movieId);
      this.fetchAllMovies();
    });
  }

  getMovieDetails(movieId: string): void {
    this.fetchApiData.getMovieDetails(movieId).subscribe(
      (resp: any) => {
        console.log(resp); // Log the response to see if data is retrieved successfully
        this.movieData = resp;
      },
      (error: any) => {
        console.error(error);
        this.errorMessage = 'Failed to load movie details.';
      }
    );
  }

  fetchAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (resp: any) => {
        this.allMovies = resp;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  goToNextMovie(): void {
    const currentIndex = this.allMovies.findIndex(movie => movie._id === this.movieId);
    const nextIndex = (currentIndex + 1) % this.allMovies.length; // Circular navigation
    const nextMovieId = this.allMovies[nextIndex]._id;
    this.router.navigate(['/movies', nextMovieId]);
  }

  goToPreviousMovie(): void {
    const currentIndex = this.allMovies.findIndex(movie => movie._id === this.movieId);
    const previousIndex = (currentIndex - 1 + this.allMovies.length) % this.allMovies.length; // Circular navigation
    const previousMovieId = this.allMovies[previousIndex]._id;
    this.router.navigate(['/movies', previousMovieId]);
  }

  addToFavorites(): void {
    const index = this.loggedInUser.FavoriteMovies.findIndex((favMovie: any) => favMovie === this.movieData._id);
    if (index === -1) {
      // Movie not in favorites, add it
      this.fetchApiData.addMovieToFavorites(this.loggedInUser.Username, this.movieData._id).subscribe((resp: any) => {
        console.log('Movie added to favorites:', resp);
        this.loggedInUser.FavoriteMovies.push(this.movieData._id);
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      });
    } else {
      // Movie already in favorites, remove it
      this.fetchApiData.deleteMovieFromFavorites(this.loggedInUser.Username, this.movieData._id).subscribe((resp: any) => {
        console.log('Movie removed from favorites:', resp);
        this.loggedInUser.FavoriteMovies.splice(index, 1);
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      });
    }
  }

  isFavorite(): boolean {
    return this.loggedInUser.FavoriteMovies.includes(this.movieData._id);
  }
}
