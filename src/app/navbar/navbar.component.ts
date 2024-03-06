/**
 * Component representing the navigation bar.
 * @remarks
 * This component handles navigation and displays the navigation bar.
 */
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
  /**
   * Indicates whether the screen size is small or not.
   */
  isSmallScreen: boolean = false;

  /**
   * Subscription to observe breakpoints for screen size changes.
   */
  private breakpointSubscription: Subscription;

  /**
   * Flag indicating user authentication status.
   */
  isLoggedIn: boolean = false;

  /**
   * Constructs a new instance of NavbarComponent.
   * @param router - Angular router for navigation.
   * @param snackBar - Material snackbar for displaying notifications.
   * @param breakpointObserver - Observes breakpoints for screen size changes.
   */
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

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from the breakpoint subscription.
   */
  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  /**
   * Logs the user out.
   * Clears user data and token from local storage, navigates to the welcome page,
   * displays a logout message, and updates the authentication status.
   */
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
