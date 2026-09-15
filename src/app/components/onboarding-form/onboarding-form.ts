import { Component, DestroyRef, inject, signal } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { MatSelectSearchComponent } from 'ngx-mat-select-search';

import { IamService } from '../../services/api/iam-service';
import { Specialisation } from '../../models/specialistation-model';

import { Experience, Proficiency, Role } from '../../models/global-model';

import { OnboardUserRequest, UserSpecialisationRequest } from '../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Title } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

type SpecialisationForm = FormGroup<{
  specialisationId: FormControl<string>;
  proficiency: FormControl<Proficiency | ''>;
}>;

@Component({
  selector: 'app-onboarding-form',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatDivider,
    MatCardModule,
    MatSelectSearchComponent,
  ],

  templateUrl: './onboarding-form.html',
  styleUrl: './onboarding-form.css',
})
export class OnboardingForm {
  private readonly dialogRef = inject(MatDialogRef<OnboardingForm>);
  private readonly title = inject(Title);
  private readonly fb = inject(FormBuilder);
  private readonly iamService = inject(IamService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly Experience = Experience;
  protected readonly maxSpecializations = 5;
  protected readonly specialisations = signal<Specialisation[]>([]);
  protected readonly filteredSpecialisations = signal<Specialisation[]>([]);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly specializationSearchControl = new FormControl('', {
    nonNullable: true,
  });
  protected readonly specializationSelectControl = new FormControl<string[]>([], {
    nonNullable: true,
  });
  protected readonly onboardingForm = this.fb.group({
    specialisations: this.fb.group({
      specialisations: this.fb.array<SpecialisationForm>([], {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(this.maxSpecializations),
        ],
      }),
    }),

    experience: this.fb.group({
      experience: this.fb.control<Experience | ''>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),

      experienceYears: this.fb.control<number | undefined>(undefined, {
        nonNullable: true,
      }),

      organizationName: this.fb.control<string | undefined>(undefined, {
        nonNullable: true,
      }),

      organizationRole: this.fb.control<string | undefined>(undefined, {
        nonNullable: true,
      }),
    }),

    role: this.fb.control<Role | ''>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  protected readonly knowledgeLevels = [
    { value: Proficiency.BEGINNER, label: 'Beginner' },
    { value: Proficiency.INTERMEDIATE, label: 'Intermediate' },
    { value: Proficiency.EXPERT, label: 'Expert' },
  ];

  protected readonly accountTypes = [
    {
      value: Role.USER,
      label: 'User',
      description: 'Practice interviews, connect with peers, and improve your skills.',
      icon: 'person',
    },
    {
      value: Role.INSTRUCTOR,
      label: 'Instructor',
      description: 'Help others prepare for interviews and share your expertise.',
      icon: 'school',
    },
  ];

  protected get specialisationsForm() {
    return this.onboardingForm.controls.specialisations;
  }

  protected get experienceForm() {
    return this.onboardingForm.controls.experience;
  }

  protected get roleControl() {
    return this.onboardingForm.controls.role;
  }

  protected get experienceControl() {
    return this.experienceForm.controls.experience;
  }

  protected get experienceYearsControl() {
    return this.experienceForm.controls.experienceYears;
  }

  protected get organizationNameControl() {
    return this.experienceForm.controls.organizationName;
  }

  protected get organizationRoleControl() {
    return this.experienceForm.controls.organizationRole;
  }

  protected get specializationArray(): FormArray<SpecialisationForm> {
    return this.specialisationsForm.controls.specialisations;
  }

  protected get selectedSpecializationCount(): number {
    return this.specializationArray.length;
  }

  protected get maxSpecializationsReached(): boolean {
    return this.selectedSpecializationCount >= this.maxSpecializations;
  }

  protected get isExperienced(): boolean {
    return this.experienceControl.value === Experience.EXPERIENCED;
  }

  protected get selectedRoleLabel(): string {
    const role = this.roleControl.value;
    if (role === Role.INSTRUCTOR) {
      return 'Instructor';
    }
    if (role === Role.USER) {
      return 'User';
    }
    return '';
  }

  protected get isInstructor(): boolean {
    return this.roleControl.value === Role.INSTRUCTOR;
  }

  constructor() {
    this.title.setTitle('Onboarding | VartaHub');
    this.loadSpecialisations();
    this.specializationSearchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        this.filterSpecialisations(search);
      });
    this.roleControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((role) => {
      this.onRoleChange(role);
    });
  }

  private loadSpecialisations(): void {
    this.submitError.set(null);
    this.iamService
      .getSpecialisations(0, 100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.specialisations.set(page.content);
          this.filteredSpecialisations.set([...page.content]);
        },
        error: (error) => {
          console.error('Failed to load specialisations:', error);
          this.submitError.set('Unable to load specializations.');
        },
      });
  }

  private filterSpecialisations(search: string): void {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      this.filteredSpecialisations.set([...this.specialisations()]);

      return;
    }

    this.filteredSpecialisations.set(
      this.specialisations().filter(
        (specialisation) =>
          specialisation.name.toLowerCase().includes(searchValue) ||
          specialisation.slug.toLowerCase().includes(searchValue),
      ),
    );
  }

  protected isSpecializationSelected(specialisationId: string): boolean {
    return this.getSelectedSpecializationIds().includes(specialisationId);
  }

  protected getSelectedSpecializationIds(): string[] {
    return this.specializationArray.controls.map(
      (control) => control.controls.specialisationId.value,
    );
  }

  protected getSelectedSpecialisations(): Specialisation[] {
    const selectedIds = this.getSelectedSpecializationIds();
    return this.specialisations().filter((specialisation) =>
      selectedIds.includes(specialisation.id),
    );
  }

  protected isSpecializationDisabled(specialisationId: string): boolean {
    return this.maxSpecializationsReached && !this.isSpecializationSelected(specialisationId);
  }

  protected getSpecializationGroup(specialisationId: string): SpecialisationForm | null {
    const index = this.getSpecializationIndex(specialisationId);

    if (index === -1) {
      return null;
    }
    return this.specializationArray.at(index);
  }

  private getSpecializationIndex(specialisationId: string): number {
    return this.specializationArray.controls.findIndex(
      (control) => control.controls.specialisationId.value === specialisationId,
    );
  }

  protected getProficiency(specialisationId: string): Proficiency | '' {
    const group = this.getSpecializationGroup(specialisationId);
    return group?.controls.proficiency.value ?? '';
  }

  protected setProficiency(specialisationId: string, proficiency: Proficiency): void {
    const group = this.getSpecializationGroup(specialisationId);
    if (!group) {
      return;
    }
    group.controls.proficiency.setValue(proficiency);
    group.controls.proficiency.markAsTouched();
  }

  protected isProficiencyInvalid(specialisationId: string): boolean {
    const group = this.getSpecializationGroup(specialisationId);
    if (!group) {
      return false;
    }
    const proficiencyControl = group.controls.proficiency;
    return proficiencyControl.invalid && proficiencyControl.touched;
  }

  /**
   * Handle multi-selection.
   *
   * Maximum = 5.
   */
  protected onSpecializationsChange(selectedIds: string[]): void {
    const selectedSpecialisationIds = selectedIds.slice(0, this.maxSpecializations);
    for (let index = this.specializationArray.length - 1; index >= 0; index--) {
      const specialisationId = this.specializationArray.at(index).controls.specialisationId.value;
      if (!selectedSpecialisationIds.includes(specialisationId)) {
        this.specializationArray.removeAt(index);
      }
    }

    for (const specialisationId of selectedSpecialisationIds) {
      if (!this.isSpecializationSelected(specialisationId)) {
        this.specializationArray.push(this.createSpecializationGroup(specialisationId));
      }
    }
    this.updateSpecializationValidity();
  }

  private onRoleChange(role: Role | ''): void {
    if (role === Role.INSTRUCTOR && this.experienceControl.value === Experience.FRESHER) {
      this.experienceControl.setValue(Experience.EXPERIENCED);
    }
    this.updateExperienceValidators();
  }

  private createSpecializationGroup(specialisationId: string): SpecialisationForm {
    return this.fb.group({
      specialisationId: this.fb.control(specialisationId, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      proficiency: this.fb.control<Proficiency | ''>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  private updateSpecializationValidity(): void {
    this.specializationArray.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(this.maxSpecializations),
    ]);
    this.specializationArray.updateValueAndValidity();
  }

  protected removeSpecialization(specialisationId: string): void {
    const index = this.getSpecializationIndex(specialisationId);
    if (index !== -1) {
      this.specializationArray.removeAt(index);
    }
    this.specializationSelectControl.setValue(this.getSelectedSpecializationIds());
    this.updateSpecializationValidity();
  }

  protected clearSpecializationSearch(): void {
    this.specializationSearchControl.setValue('');
  }

  protected onExperienceChange(): void {
    this.updateExperienceValidators();
  }

  /**
   * Apply experience validators according to:
   *
   * User + Fresher:
   *   No experience details required.
   *
   * User + Experienced:
   *   Years       -> required
   *   Role        -> required
   *   Organization -> required
   *
   * Instructor + Fresher:
   *   No experience details required.
   *
   * Instructor + Experienced:
   *   Years       -> required
   *   Role        -> required
   *   Organization -> optional
   */
  private updateExperienceValidators(): void {
    const experience = this.experienceControl.value;
    const role = this.roleControl.value;

    this.experienceYearsControl.clearValidators();
    this.organizationNameControl.clearValidators();
    this.organizationRoleControl.clearValidators();

    if (experience === Experience.EXPERIENCED) {
      this.experienceYearsControl.setValidators([
        Validators.required,
        Validators.min(0.1),
        Validators.max(60),
      ]);

      this.organizationRoleControl.setValidators([Validators.required, Validators.maxLength(100)]);

      if (role === Role.USER) {
        this.organizationNameControl.setValidators([
          Validators.required,
          Validators.maxLength(150),
        ]);
      } else if (role === Role.INSTRUCTOR) {
        this.organizationNameControl.setValidators([Validators.maxLength(150)]);
      }
    }

    this.experienceYearsControl.updateValueAndValidity();
    this.organizationNameControl.updateValueAndValidity();
    this.organizationRoleControl.updateValueAndValidity();
  }

  private constructOnboardUserRequest(): OnboardUserRequest {
    const formValue = this.onboardingForm.getRawValue();

    const specialisations: UserSpecialisationRequest[] =
      formValue.specialisations.specialisations.map((specialisation) => ({
        specialisationId: specialisation.specialisationId,
        proficiency: specialisation.proficiency as Proficiency,
      }));

    return {
      specialisations,
      experience: formValue.experience.experience as Experience,
      role: formValue.role as Role,
      experienceYears: formValue.experience.experienceYears,
      organizationName: formValue.experience.organizationName,
      organizationRole: formValue.experience.organizationRole,
    };
  }

  protected onboardUser(): void {
    this.submitError.set(null);
    this.updateExperienceValidators();
    if (this.onboardingForm.invalid) {
      this.onboardingForm.markAllAsTouched();
      return;
    }
    const onboardUserRequest = this.constructOnboardUserRequest();
    this.iamService.onboardUser(onboardUserRequest)
      .subscribe(onboardUserResponse => {
        this.dialogRef.close();
      })
  }
}
