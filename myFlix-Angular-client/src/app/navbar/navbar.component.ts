import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    public router: Router,
    public snackBar: MatSnackBar
    ) {}

  logOff(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been successfully logged out.', 'OK', {
      duration: 2000
    })
  }
}
