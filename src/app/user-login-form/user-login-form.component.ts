/**
 * Component representing the user login form.
 * @remarks
 * This component handles user login and displays the login form.
 */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  /**
   * User login data.
   */
  userData = { Username: '', Password: '' };

  /**
   * Constructs a new instance of UserLoginFormComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param dialogRef - Reference to the dialog opened by MatDialog.
   * @param snackBar - Material snackbar for displaying notifications.
   * @param router - Angular router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   * Does nothing in this component.
   */
  ngOnInit(): void {
  }

  /**
   * Logs in the user by making a call to the API.
   * Upon successful login, stores user information and token in local storage,
   * closes the dialog, displays a success message, and navigates to the movies page.
   * @remarks
   * If login fails, displays an error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close();
      console.log(result);
      this.snackBar.open('Login successful!', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (result) => {
      this.snackBar.open('Invalid Username or Password', 'OK', {
        duration: 2000
      });
    });
  }
}
