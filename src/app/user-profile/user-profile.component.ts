/**
 * Component representing the user profile page.
 * @remarks
 * This component manages user profile data, allows updating user information, deleting the user account,
 * and provides functionality related to favorite movies.
 */
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  /**
   * User data.
   */
  user: any;
  
  /**
   * Updated user data.
   */
  updatedUserData: any = {};
  
  /**
   * Array of favorite movies.
   */
  favoriteMovies: any[] = [];
  
  /**
   * New password.
   */
  newPassword: string = '';
  
  /**
   * Confirm password.
   */
  confirmPassword: string = '';
  
  /**
   * Flag indicating whether user is in editing mode.
   */
  isEditing: boolean = false;

  /**
   * Constructs a new instance of UserProfileComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param snackBar - Material snackbar for displaying notifications.
   * @param router - Angular router for navigation.
   * @param dialog - Material dialog for displaying dialogs.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves user data and favorite movies on initialization.
   */
  ngOnInit(): void {
    this.getUserData();
    this.getFavoriteMovies();
  }

  /**
   * Retrieves user data from the API.
   */
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

  /**
   * Retrieves favorite movies for the user from the API.
   */
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

  /**
   * Updates user data by making a call to the API.
   */
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

  /**
   * Deletes the user account.
   * Navigates to the welcome page upon successful deletion.
   */
  deleteUser(): void {
    // Step 1: Navigate to the welcome page
    this.router.navigate(['/welcome']);
    
    // Step 2: Delete the account from the database
    const username = this.user.Username;
    this.fetchApiData.deleteUser(username).subscribe(
      () => {
        localStorage.clear();
        console.log('Account deleted successfully');
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

  /**
   * Toggles the edit mode.
   * If editing starts, clears the password field and formats the birthday for editing.
   */
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset updatedUserData if not editing
      this.updatedUserData = { ...this.user };
    } else {
      // Clear password field when editing starts
      this.updatedUserData.Password = '';
  
      // Format the birthday for editing
      if (this.user && this.user.Birthday) {
        const userBirthday = new Date(this.user.Birthday);
        const year = userBirthday.getFullYear();
        let month: string | number = userBirthday.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        let day: string | number = userBirthday.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        this.updatedUserData.Birthday = `${year}-${month}-${day}`;
      }
    }
  }
  
  /**
   * Adds or removes a movie from favorites.
   * @param movie - The movie to be added or removed from favorites.
   */
  addToFavorites(movie: any): void {
    const index = this.favoriteMovies.findIndex((favMovie: any) => favMovie._id === movie._id);
    if (index === -1) {
      // Movie not in favorites, add it
      this.fetchApiData.addMovieToFavorites(this.user.Username, movie._id).subscribe((resp: any) => {
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
      this.fetchApiData.deleteMovieFromFavorites(this.user.Username, movieId).subscribe((resp: any) => {
        console.log('Movie removed from favorites:', resp);
        this.favoriteMovies = this.favoriteMovies.filter((favMovie: any) => favMovie._id !== movieId);
        this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
      }, (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to remove movie from favorites', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * Opens a dialog to display genre information.
   * @param genreData - Data related to the genre to be displayed in the dialog.
   */
  openGenreDialog(genreData: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '300px',
      data: genreData
    });
  }

  /**
   * Opens a dialog to display director information.
   * @param directorData - Data related to the director to be displayed in the dialog.
   */
  openDirectorDialog(directorData: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '300px',
      data: directorData
    });
  }

  /**
   * Opens a dialog to display movie synopsis.
   * @param movieData - Data related to the movie to be displayed in the dialog.
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
   * Checks if a movie is in the list of favorite movies.
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is in the list of favorite movies, otherwise false.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }

  /**
   * Redirects to the details page of a movie.
   * @param movieTitle - The title of the movie to navigate to its details page.
   */
  redirectToMovieDetails(movieTitle: string): void {
    this.router.navigate(['/movies', movieTitle]);
  }
}
