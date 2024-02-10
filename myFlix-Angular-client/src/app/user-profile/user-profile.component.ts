import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any;

  constructor(private fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe(
        (response: any) => {
          this.user = response;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
}