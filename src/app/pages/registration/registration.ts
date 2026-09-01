import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

interface Specialization {
  name: string;
  level: KnowledgeLevel | '';
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],
  styleUrl: './registration.css',
  templateUrl: './registration.html',
})
export class Registration {
  private readonly fb = inject(FormBuilder);

  protected readonly maxSpecializations = 5;

  // ============================================================
  // FORM
  // ============================================================

  protected readonly registrationForm = this.fb.group({
    basicInformation: this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],

        lastName: ['', [Validators.required, Validators.maxLength(50)]],

        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

        email: ['', [Validators.required, Validators.email]],

        password: ['', [Validators.required, Validators.minLength(8)]],

        confirmPassword: ['', Validators.required],

        avatar: [null as File | null],
      },
      {
        validators: (control: AbstractControl) => this.passwordMatchValidator(control),
      },
    ),

    // ----------------------------------------------------------
    // INTERESTS / SPECIALIZATIONS
    // ----------------------------------------------------------

    interests: this.fb.group({
      specializations: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ),
    }),

    // ----------------------------------------------------------
    // EXPERIENCE
    // ----------------------------------------------------------

    experience: this.fb.group({
      experienceType: ['', Validators.required],

      experienceDuration: [''],

      companyName: [''],
    }),

    // ----------------------------------------------------------
    // ACCOUNT TYPE
    // ----------------------------------------------------------

    accountType: this.fb.group({
      type: ['', Validators.required],
    }),
  });

  // ============================================================
  // AVATAR
  // ============================================================

  protected avatarPreview: string | null = null;

  // ============================================================
  // SPECIALIZATIONS
  // ============================================================

  protected readonly specializations: string[] = [
    'Java',
    'Spring Boot',
    'C++',
    'Python',
    'JavaScript',
    'TypeScript',
    'Angular',
    'React',
    'Next.js',
    'Node.js',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Data Science',
    'Data Analytics',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Database Management',
    'System Design',
    'Software Architecture',
    'UI/UX Design',
    'Product Management',
    'Financial Analysis',
    'Investment Banking',
    'Accounting',
    'FinTech',
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Surgery',
  ];

  protected readonly knowledgeLevels: {
    value: KnowledgeLevel;
    label: string;
  }[] = [
    {
      value: 'beginner',
      label: 'Beginner',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
    },
    {
      value: 'advanced',
      label: 'Advanced',
    },
  ];

  /**
   * Search field for specialization.
   */
  protected readonly specializationSearchControl = new FormControl('', {
    nonNullable: true,
  });

  /**
   * Filtered specialization options.
   */
  protected filteredSpecializations: string[] = [...this.specializations];

  // ============================================================
  // GETTERS
  // ============================================================

  protected get basicInformation() {
    return this.registrationForm.controls['basicInformation'];
  }

  protected get interestsForm() {
    return this.registrationForm.controls['interests'];
  }

  protected get experienceForm() {
    return this.registrationForm.controls['experience'];
  }

  protected get accountTypeForm() {
    return this.registrationForm.controls['accountType'];
  }

  protected get selectedAccountType(): string {
    return this.accountTypeForm.controls['type'].value ?? '';
  }

  protected get isExperienced(): boolean {
    return this.experienceForm.controls['experienceType'].value === 'experienced';
  }

  /**
   * Specializations FormArray.
   */
  protected get specializationArray(): FormArray {
    return this.interestsForm.controls['specializations'] as FormArray;
  }

  /**
   * Number of selected specializations.
   */
  protected get selectedSpecializationCount(): number {
    return this.specializationArray.length;
  }

  /**
   * Whether maximum number of specializations has been selected.
   */
  protected get maxSpecializationsReached(): boolean {
    return this.selectedSpecializationCount >= this.maxSpecializations;
  }

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    this.specializationSearchControl.valueChanges.subscribe((search) => {
      const searchValue = search.toLowerCase().trim();

      this.filteredSpecializations = this.specializations.filter((specialization) =>
        specialization.toLowerCase().includes(searchValue),
      );
    });
  }

  // ============================================================
  // SPECIALIZATION HELPERS
  // ============================================================

  /**
   * Check whether a specialization has already
   * been selected.
   */
  protected isSpecializationSelected(specialization: string): boolean {
    return this.getSelectedSpecializationNames().includes(specialization);
  }

  /**
   * Get all selected specialization names.
   */
  protected getSelectedSpecializationNames(): string[] {
    return this.specializationArray.controls.map((control) => control.get('name')?.value as string);
  }

  /**
   * Determines whether a specialization option
   * should be disabled.
   *
   * Once 5 are selected, all unselected options
   * become disabled.
   */
  protected isSpecializationDisabled(specialization: string): boolean {
    return this.maxSpecializationsReached && !this.isSpecializationSelected(specialization);
  }

  /**
   * Get a specialization FormGroup by its name.
   */
  protected getSpecializationGroup(specialization: string): FormGroup | null {
    const index = this.getSpecializationIndex(specialization);

    if (index === -1) {
      return null;
    }

    return this.specializationArray.at(index) as FormGroup;
  }

  /**
   * Get specialization index by name.
   */
  private getSpecializationIndex(specialization: string): number {
    return this.specializationArray.controls.findIndex(
      (control) => control.get('name')?.value === specialization,
    );
  }

  /**
   * Get current knowledge level for a specialization.
   */
  protected getKnowledgeLevel(specialization: string): string {
    const group = this.getSpecializationGroup(specialization);

    return group?.get('level')?.value ?? '';
  }

  // ============================================================
  // SPECIALIZATION SELECTION
  // ============================================================

  /**
   * Called whenever the multi-select changes.
   *
   * Adds newly selected specializations and removes
   * specializations that were unselected.
   */
  protected onSpecializationsChange(selected: string[]): void {
    const selectedNames = selected.slice(0, this.maxSpecializations);

    // ----------------------------------------------------------
    // Remove specializations which were unselected
    // ----------------------------------------------------------

    for (let index = this.specializationArray.length - 1; index >= 0; index--) {
      const name = this.specializationArray.at(index).get('name')?.value;

      if (!selectedNames.includes(name)) {
        this.specializationArray.removeAt(index);
      }
    }

    // ----------------------------------------------------------
    // Add newly selected specializations
    // ----------------------------------------------------------

    for (const name of selectedNames) {
      if (!this.isSpecializationSelected(name)) {
        this.specializationArray.push(this.createSpecializationGroup(name));
      }
    }

    this.updateSpecializationValidity();
  }

  /**
   * Create one specialization FormGroup.
   */
  private createSpecializationGroup(name: string): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],

      level: ['', Validators.required],
    });
  }

  /**
   * Update validators after specialization changes.
   */
  private updateSpecializationValidity(): void {
    this.specializationArray.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(this.maxSpecializations),
    ]);

    this.specializationArray.updateValueAndValidity();
  }

  /**npx re wirte .
   * Remove one specialization.
   */
  protected removeSpecialization(specialization: string): void {
    const index = this.getSpecializationIndex(specialization);

    if (index !== -1) {
      this.specializationArray.removeAt(index);
    }

    this.updateSpecializationValidity();
  }

  /**
   * Clear search after dropdown closes.
   */
  protected clearSpecializationSearch(): void {
    this.specializationSearchControl.setValue('');
  }

  // ============================================================
  // EXPERIENCE
  // ============================================================

  protected onExperienceTypeChange(): void {
    const experienceType = this.experienceForm.controls['experienceType'].value;

    const accountType = this.accountTypeForm.controls['type'].value;

    const durationControl = this.experienceForm.controls['experienceDuration'];

    const companyControl = this.experienceForm.controls['companyName'];

    durationControl.clearValidators();
    companyControl.clearValidators();

    if (experienceType === 'experienced') {
      durationControl.setValidators(Validators.required);

      if (accountType === 'instructor') {
        companyControl.setValidators(Validators.required);
      }
    }

    if (experienceType === 'fresher') {
      durationControl.reset('');
      companyControl.reset('');
    }

    durationControl.updateValueAndValidity();
    companyControl.updateValueAndValidity();
  }

  // ============================================================
  // AVATAR
  // ============================================================

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.basicInformation.controls['avatar'].setValue(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  protected removeAvatar(): void {
    this.basicInformation.controls['avatar'].setValue(null);

    this.avatarPreview = null;
  }

  // ============================================================
  // ACCOUNT TYPE
  // ============================================================

  protected onAccountTypeChange(): void {
    const accountType = this.accountTypeForm.controls['type'].value;

    if (accountType === 'instructor') {
      this.experienceForm.controls['experienceType'].setValue('experienced');
    }

    this.onExperienceTypeChange();
  }

  // ============================================================
  // PASSWORD VALIDATION
  // ============================================================

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : {
          passwordMismatch: true,
        };
  }

  // ============================================================
  // CREATE ACCOUNT
  // ============================================================

  protected createAccount(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      return;
    }

    const formValue = this.registrationForm.getRawValue();

    console.log('Registration data:', formValue);
  }
}
