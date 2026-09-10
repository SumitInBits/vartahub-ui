import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Meeting } from '../meeting-page';

@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-meeting-details-dialog',
  styleUrl: './meeting-details-dialog.css',
  templateUrl: './meeting-details-dialog.html',
})
export class MeetingDetailsDialog {
  private readonly dialogRef = inject(MatDialogRef<MeetingDetailsDialog>);
  protected readonly meeting = inject<Meeting>(MAT_DIALOG_DATA);

  protected close(): void {
    this.dialogRef.close();
  }
}
