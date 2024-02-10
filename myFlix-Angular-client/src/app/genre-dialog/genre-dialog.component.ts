import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
})
export class GenreDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
