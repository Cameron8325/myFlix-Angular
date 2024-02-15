import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any;
  updatedUserData: any = {};
  favoriteMovies: any[] = [];
  newPassword: string = '';
  confirmPassword: string = '';
  isEditing: boolean = false;

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.getFavoriteMovies();
  }

  getUserData(): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    this.fetchApiData.getUser(username).subscribe(
      (response: any) => {
        this.user = response;
        this.updatedUserData = { ...this.user };
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to retrieve user data', 'OK', {
          duration: 2000
        });
      }
    );
  }

  getFavoriteMovies(): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    this.fetchApiData.getFavoriteMovies(username).subscribe(
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


  updateUserData(): void {
    // Create an object to hold the updated user data
    const updatedData: any = {};

    // Check if the user has entered new values for username, email, and birthday
    // If yes, assign those values to the updatedData object
    if (this.updatedUserData.Username) {
      updatedData.Username = this.updatedUserData.Username;
    }
    if (this.updatedUserData.Email) {
      updatedData.Email = this.updatedUserData.Email;
    }
    if (this.updatedUserData.Birthday) {
      updatedData.Birthday = this.updatedUserData.Birthday;
    }
    if (this.updatedUserData.Password) {
      updatedData.Password = this.updatedUserData.Password;
    }

    // If the updatedData object is empty, do not make any API call
    if (Object.keys(updatedData).length === 0) {
      this.snackBar.open('No changes to save', 'OK', { duration: 2000 });
      return;
    }

    // Call the API to update user data with the updatedData object
    this.fetchApiData.editUser(this.user.Username, updatedData).subscribe(
      (response: any) => {
        // Update user data in the component if the API call is successful
        this.user = { ...this.user, ...updatedData };
        this.isEditing = false;
        this.snackBar.open('User data updated successfully', 'OK', { duration: 2000 });
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to update user data', 'OK', { duration: 2000 });
      }
    );
  }

  deleteUser(): void {
    const username = this.user.Username;
    this.fetchApiData.deleteUser(username).subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['/welcome']);
        this.snackBar.open('Account deleted successfully', 'OK', {
          duration: 2000
        });
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to delete user account', 'OK', {
          duration: 2000
        });
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset updatedUserData if not editing
      this.updatedUserData = { ...this.user };
    }
  }

  removeFromFavorites(movieId: string): void {
    const username = this.user.Username;
    this.fetchApiData.deleteMovieFromFavorites(username, movieId).subscribe(
      () => {
        const index = this.favoriteMovies.findIndex(movie => movie._id === movieId);
        if (index !== -1) {
          this.favoriteMovies.splice(index, 1);
          this.snackBar.open('Movie removed from favorites', 'OK', {
            duration: 2000
          });
        }
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to remove movie from favorites', 'OK', {
          duration: 2000
        });
      }
    );
  }
}
