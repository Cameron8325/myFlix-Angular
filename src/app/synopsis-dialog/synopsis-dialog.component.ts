/**
 * Component representing the synopsis dialog.
 * @remarks
 * This component displays the synopsis of a movie in a dialog.
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-dialog',
  templateUrl: './synopsis-dialog.component.html',
  styleUrls: ['./synopsis-dialog.component.scss']
})
export class SynopsisDialogComponent {
  /**
   * Constructs a new instance of SynopsisDialogComponent.
   * @param data - Data containing the movie synopsis.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
    }
  ) {}
}
