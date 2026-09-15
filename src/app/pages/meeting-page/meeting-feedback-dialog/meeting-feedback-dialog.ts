import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface FeedbackDialogData {
  meeting: {
    id: number;
    title: string;
    instructor: string;
    feedback?: {
      submitted: boolean;
      rating?: number;
      comment?: string;
    };
  };
  mode: 'view' | 'give';
}

@Component({
  selector: 'app-meeting-feedback-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './meeting-feedback-dialog.html',
})
export class MeetingFeedbackDialog {
  readonly dialogRef = inject(MatDialogRef<MeetingFeedbackDialog>);
  readonly data = inject<FeedbackDialogData>(MAT_DIALOG_DATA);

  // Initialize rating (default to 5 if new feedback)
  protected rating = this.data.meeting.feedback?.rating ?? 5;
  protected comment = this.data.meeting.feedback?.comment ?? '';
  protected hoverRating = 0; // Optional: for hover effects

  protected setRating(star: number): void {
    if (this.data.mode === 'give') {
      this.rating = star;
    }
  }

  protected submitFeedback(): void {
    this.dialogRef.close({
      submitted: true,
      rating: this.rating,
      comment: this.comment,
    });
  }
}
