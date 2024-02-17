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
  user: any;
  updatedUserData: any = {};
  favoriteMovies: any[] = [];
  newPassword: string = '';
  confirmPassword: string = '';
  isEditing: boolean = false;

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
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

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }

  redirectToMovieDetails(movieTitle: string): void {
    this.router.navigate(['/movies', movieTitle]);
  }    

}
