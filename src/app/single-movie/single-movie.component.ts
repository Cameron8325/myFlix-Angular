/**
 * Component representing the single movie details page.
 * @remarks
 * This component displays details of a single movie and provides navigation between movies.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-single-movie',
  templateUrl: './single-movie.component.html',
  styleUrls: ['./single-movie.component.scss']
})
export class SingleMovieComponent implements OnInit {
  /**
   * The ID of the movie to display details for.
   */
  movieId!: string;
  
  /**
   * Contains details of the movie.
   */
  movieData: any;
  
  /**
   * Error message to display if movie details cannot be retrieved.
   */
  errorMessage: string = '';
  
  /**
   * Information of the logged-in user.
   */
  loggedInUser: any;
  
  /**
   * Array containing details of all movies.
   */
  allMovies: any[] = [];

  /**
   * Constructs a new instance of SingleMovieComponent.
   * @param route - Provides access to the route parameters.
   * @param router - Angular router for navigation.
   * @param fetchApiData - Service for fetching API data.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchApiData: FetchApiDataService
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves movie details and all movies upon component initialization.
   */
  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
      this.getMovieDetails(this.movieId);
      this.fetchAllMovies();
    });
  }

  /**
   * Retrieves details of a specific movie.
   * @param movieId - The ID of the movie to retrieve details for.
   */
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

  /**
   * Retrieves details of all movies.
   */
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

  /**
   * Navigates to the next movie.
   */
  goToNextMovie(): void {
    const currentIndex = this.allMovies.findIndex(movie => movie.Title === this.movieId);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.allMovies.length) {
      nextIndex = 0; // Cycling back to the first movie
    }
    const nextMovieId = this.allMovies[nextIndex].Title;
    this.router.navigate(['/movies', nextMovieId]);
  }

  /**
   * Navigates to the previous movie.
   */
  goToPreviousMovie(): void {
    const currentIndex = this.allMovies.findIndex(movie => movie.Title === this.movieId);
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = this.allMovies.length - 1; // Cycling back to the last movie
    }
    const previousMovieId = this.allMovies[previousIndex].Title;
    this.router.navigate(['/movies', previousMovieId]);
  }

  /**
   * Adds the movie to the user's favorites or removes it if already present.
   */
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

  /**
   * Checks if the movie is in the user's favorites.
   * @returns True if the movie is in favorites, otherwise false.
   */
  isFavorite(): boolean {
    return this.movieData && this.loggedInUser.FavoriteMovies.includes(this.movieData._id);
  }
  
}
