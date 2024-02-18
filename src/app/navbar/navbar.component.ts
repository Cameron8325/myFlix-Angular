import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {
  isSmallScreen: boolean = false;
  private breakpointSubscription: Subscription;
  isLoggedIn: boolean = false; // Flag to indicate user authentication status

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSubscription = this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    
    // Check if user is logged in
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  logOff(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been successfully logged out.', 'OK', {
      duration: 2000
    });
    // Update authentication status
    this.isLoggedIn = false;
  }
}
