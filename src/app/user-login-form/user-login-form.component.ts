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
  userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

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