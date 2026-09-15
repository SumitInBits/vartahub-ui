import { Component, computed, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Specialisation } from '../../../models/specialistation-model';
import { createEmptyPage } from '../../../utils/global-api-util';
import { IamService } from '../../../services/api/iam-service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInput,
    RouterLink,
    MatTooltip,
  ],
  selector: 'app-manage-specialisation-page',
  styleUrl: './manage-specialisation-page.css',
  templateUrl: './manage-specialisation-page.html',
})
export class ManageSpecialisationPage {
  displayedColumns: string[] = ['id', 'slug', 'name', 'actions'];
  @ViewChild('createDialogTemplate') createDialogTemplate!: TemplateRef<any>;
  private dialogRef?: MatDialogRef<any>;
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private iamService = inject(IamService);
  protected readonly specialisationPage = toSignal(this.iamService.getSpecialisations(), {
    initialValue: createEmptyPage<Specialisation>(10),
  });
  protected readonly specialisations = computed(() => this.specialisationPage().content);

  protected readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    console.log('Page:', event.pageIndex);
    console.log('Size:', event.pageSize);

    // Load the requested page from backend
  }

  openCreateDialog(): void {
    this.form.reset();
    this.dialogRef = this.dialog.open(this.createDialogTemplate, {
      width: '440px',
      panelClass: ['rounded-3xl'],
    });
  }

  createSpecialisations(): void {
    if (this.form.valid) {
      this.iamService.createSpecialisations(this.form.value).subscribe({
        next: () => {
          this.dialogRef?.close();
        },
        error: (err) => {
          console.error('Failed to create specialisation', err);
        },
      });
    }
  }

  deleteSpecialisation(id: string): void {
    this.iamService.deleteSpecialisation(id).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Failed to delete specialisation', err);
      },
    });
  }
}
