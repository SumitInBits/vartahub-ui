import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  templateUrl: './schedule-meeting-page.html',
  styleUrl: './schedule-meeting-page.css',
})
export class ScheduleMeetingPage implements OnInit {
  protected readonly meetingForm: FormGroup;

  protected readonly searchTermSignal = signal('');

  protected readonly selectedInstructorName = signal<string | null>(null);
  protected readonly selectedInstructorId = signal<string | null>(null);

  protected readonly selectedDuration = signal(30);

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

    return this.skills.filter((skill) =>
      skill.toLowerCase().includes(search),
    );
  });

  protected readonly levels = [
    {
      value: 'beginner',
      label: 'Beginner',
      icon: 'sentiment_satisfied',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      icon: 'trending_up',
    },
    {
      value: 'advanced',
      label: 'Advanced',
      icon: 'workspace_premium',
    },
  ];

  protected readonly practiceWithOptions = [
    {
      value: 'peer',
      label: 'Another learner',
      description: 'Practice with a peer',
      icon: 'group',
    },
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
    this.meetingForm = this.fb.group({
      skill: ['', Validators.required],
      level: ['intermediate', Validators.required],
      date: [new Date(), Validators.required],
      availableFrom: ['21:00', Validators.required],
      availableUntil: ['00:00', Validators.required],
      duration: [
        30,
        [
          Validators.required,
          Validators.min(30),
          Validators.max(60),
        ],
      ],
      practiceWith: ['peer', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['instructor']) {
        this.selectedInstructorName.set(params['instructor']);
        this.selectedInstructorId.set(params['instructorId'] || null);

        this.meetingForm.patchValue({
          practiceWith: 'instructor',
        });
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

  protected adjustDuration(amount: number): void {
    const current = this.meetingForm.get('duration')?.value || 30;
    const updated = current + amount;

    if (updated >= 30 && updated <= 60) {
      this.meetingForm.patchValue({
        duration: updated,
      });

      this.selectedDuration.set(updated);
    }
  }

  protected chooseAnotherInstructor(): void {
    this.router.navigate(['/instructor']);
  }

  protected resetForm(): void {
    this.meetingForm.reset({
      skill: '',
      level: 'intermediate',
      date: new Date(),
      availableFrom: '21:00',
      availableUntil: '00:00',
      duration: 30,
      practiceWith: 'peer',
    });

    this.selectedInstructorName.set(null);
    this.selectedInstructorId.set(null);
    this.selectedDuration.set(30);
    this.searchTermSignal.set('');
  }

  protected canCreateMeeting(): boolean {
    return this.meetingForm.valid;
  }

  protected createMeeting(): void {
    if (!this.canCreateMeeting()) {
      return;
    }

    const payload = {
      ...this.meetingForm.value,
      instructorId: this.selectedInstructorId(),
      instructorName: this.selectedInstructorName(),
    };

    console.log('Meeting payload created:', payload);
  }
}
