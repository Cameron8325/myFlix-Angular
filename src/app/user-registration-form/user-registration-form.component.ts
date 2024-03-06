/**
 * Component representing the user registration form.
 * @remarks
 * This component handles user registration and displays the registration form.
 */
import { Component, OnInit, Input } from '@angular/core';

// This import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * User data for registration.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructs a new instance of UserRegistrationFormComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param dialogRef - Reference to the dialog opened by MatDialog.
   * @param snackBar - Material snackbar for displaying notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  /**
   * Lifecycle hook called after component initialization.
   * Does nothing in this component.
   */
  ngOnInit(): void {
  }

  /**
   * Sends the registration form inputs to the backend for user registration.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      // Logic for a successful user registration goes here! (To be implemented)
      this.dialogRef.close(); // This will close the modal on success!
      console.log(result);
      this.snackBar.open('Registration Successful', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open('Registration Failed', 'OK', {
        duration: 2000
      });
    });
  }
}
