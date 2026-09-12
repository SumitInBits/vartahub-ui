import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Instructor } from './instructor-page';

@Component({
  selector: 'app-instructor-profile-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './instructor-profile-dialog.html',
  styleUrl: './instructor-profile-dailog.css',
})
export class InstructorProfileDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly instructor: Instructor,
    private readonly dialogRef: MatDialogRef<InstructorProfileDialog>,
    private readonly router: Router,
  ) {}

  protected close(): void {
    this.dialogRef.close();
  }

  protected createMeeting(): void {
    this.dialogRef.close();

    this.router.navigate(['/schedule-meeting'], {
      queryParams: {
        instructor: this.instructor.name,
        instructorId: this.instructor.id,
      },
    });
  }
}
export class InstructorDialogComponent {}
