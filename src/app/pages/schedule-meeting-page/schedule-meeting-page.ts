import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl,FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';

export const availabilityTimeValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const availableFrom = control.get('availableFrom')?.value;
  const availableUntil = control.get('availableUntil')?.value;
  if (!availableFrom || !availableUntil) {
    return null;
  }
  const fromMinutes = timeToMinutes(availableFrom);
  const untilMinutes = timeToMinutes(availableUntil);

  // End time must be strictly later than start time.
  if (untilMinutes <= fromMinutes) {
    return { untilBeforeFrom: true };
  }

  // Minimum availability window is 30 minutes.
  if (untilMinutes - fromMinutes < 30) {
    return { minimumGap: true };
  }
  return null;
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

@Component({
  selector: 'app-schedule-meeting-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-meeting-page.html',
  styleUrl: './schedule-meeting-page.css',
})
export class ScheduleMeetingPage implements OnInit {
  protected readonly meetingForm: FormGroup;
  protected readonly searchTermSignal = signal('');
  protected readonly selectedInstructorName = signal<string | null>(null);
  protected readonly selectedInstructorId = signal<string | null>(null);

  protected readonly skills = [
    'Angular',
    'Java',
    'TypeScript',
    'RxJS',
    'Tailwind CSS',
    'Node.js',
    'System Design',
    'Algorithms & Data Structures',
  ];

  protected readonly filteredSkills = computed(() => {
    const search = this.searchTermSignal().toLowerCase().trim();
    if (!search) {
      return this.skills;
    }
    return this.skills.filter((skill) => skill.toLowerCase().includes(search));
  });

  protected readonly levels = [
    { value: 'beginner', label: 'Beginner', icon: 'sentiment_satisfied' },
    { value: 'intermediate', label: 'Intermediate', icon: 'trending_up' },
    { value: 'advanced', label: 'Advanced', icon: 'workspace_premium' },
  ];

  protected readonly practiceWithOptions = [
    { value: 'peer', label: 'Another learner', description: 'Practice with a peer', icon: 'group' },
    {
      value: 'instructor',
      label: 'Instructor',
      description: 'Practice with expert',
      icon: 'school',
    },
  ];

  protected readonly minDate = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.meetingForm = this.fb.group(
      {
        skill: ['', Validators.required],
        level: ['intermediate', Validators.required],
        date: [new Date(), Validators.required],
        availableFrom: ['21:00', Validators.required],
        availableUntil: ['22:00', Validators.required],
        duration: [30, [Validators.required, Validators.min(30), Validators.max(60)]],
        practiceWith: ['peer', Validators.required],
      },
      { validators: availabilityTimeValidator },
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const instructorId = params['instructorId'];
      const instructorName = params['instructor'];

      if (instructorId && instructorName) {
        this.selectedInstructorId.set(instructorId);
        this.selectedInstructorName.set(instructorName);
        this.meetingForm.patchValue({
          practiceWith: 'instructor',
        });

        this.meetingForm.get('practiceWith')?.disable({ emitEvent: false });
        return;
      }
      this.meetingForm.get('practiceWith')?.enable({ emitEvent: false });
    });

    this.meetingForm.get('availableFrom')?.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      this.availableFromSignal.set(value);
      const availableUntil = this.meetingForm.get('availableUntil')?.value;

      if (availableUntil && timeToMinutes(availableUntil) < timeToMinutes(value) + 30) {
        this.meetingForm.get('availableUntil')?.setValue(null);
      }
    });
  }

  protected filterSkills(query: string): void {
    this.searchTermSignal.set(query);
  }

  protected removeSkill(): void {
    this.meetingForm.patchValue({
      skill: '',
    });
    this.searchTermSignal.set('');
  }

  protected readonly durationOptions = [30, 35, 40, 45, 50, 55, 60];

  protected readonly timeOptions = Array.from({ length: 24 * 12 }, (_, index) => {
    const totalMinutes = index * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  protected readonly availableFromOptions = this.timeOptions.filter(
    (time) => timeToMinutes(time) <= timeToMinutes('23:25'),
  );

  protected readonly availableFromSignal = signal('21:00');
  protected readonly availableUntilOptions = computed(() => {
    const fromMinutes = timeToMinutes(this.availableFromSignal());
    const minimumUntilMinutes = fromMinutes + 30;
    return this.timeOptions.filter((time) => timeToMinutes(time) >= minimumUntilMinutes);
  });

  protected chooseAnotherInstructor(): void {
    this.router.navigate(['/instructor']);
  }

  protected resetForm(): void {
    this.meetingForm.get('practiceWith')?.enable({ emitEvent: false });

    this.meetingForm.reset({
      skill: '',
      level: 'intermediate',
      date: new Date(),
      availableFrom: '21:00',
      availableUntil: '21:30',
      duration: 30,
      practiceWith: 'peer',
    });

    this.availableFromSignal.set('21:00');
    this.selectedInstructorName.set(null);
    this.selectedInstructorId.set(null);
    this.searchTermSignal.set('');
  }

  protected createMeeting(): void {
    if (this.meetingForm.invalid) {
      this.meetingForm.markAllAsTouched();
      return;
    }

    const formValue = this.meetingForm.getRawValue();
    const payload = {
      ...formValue,
      instructorId: this.selectedInstructorId(),
      instructorName: this.selectedInstructorName(),
    };
    console.log('Meeting payload created:', payload);
  }
}
