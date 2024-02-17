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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
      this.getMovieDetails(this.movieId);
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

  goToNextMovie(): void {
    // Logic to determine the next movie in the list and navigate to its single view
    // Implement this logic as needed
  }

  goToPreviousMovie(): void {
    // Logic to determine the previous movie in the list and navigate to its single view
    // Implement this logic as needed
  }
}
