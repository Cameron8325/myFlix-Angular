import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getFavoriteMovies();
  }

  getUserData(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response: any) => {
        this.userData = response;
      });
    }
  }

  getFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe((response: any) => {
        this.favoriteMovies = response.FavoriteMovies;
      });
    }
  }

  updateUserData(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.editUser(username, this.userData).subscribe(() => {
        this.snackBar.open('User information updated successfully!', 'OK', {
          duration: 2000
        });
      }, error => {
        console.error(error);
        this.snackBar.open('Failed to update user information. Please try again.', 'OK', {
          duration: 2000
        });
      });
    }
  }

  deleteAccount(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.deleteUser(username).subscribe(() => {
        localStorage.clear();
        this.snackBar.open('Account deleted successfully!', 'OK', {
          duration: 2000
        });
      }, error => {
        console.error(error);
        this.snackBar.open('Failed to delete account. Please try again.', 'OK', {
          duration: 2000
        });
      });
    }
  }

  unfavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.deleteMovieFromFavorites(username, movieId).subscribe(() => {
        this.snackBar.open('Movie removed from favorites successfully!', 'OK', {
          duration: 2000
        });
        this.getFavoriteMovies();
      }, error => {
        console.error(error);
        this.snackBar.open('Failed to remove movie from favorites. Please try again.', 'OK', {
          duration: 2000
        });
      });
    }
  }
}
