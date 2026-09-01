import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-schedule-meeting',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
})
export class Schedule{

  meetingForm: FormGroup;

  searchTermSignal = signal<string>('');

  skills: string[] = [
    'Angular',
    'Java',
    'TypeScript',
    'RxJS',
    'Tailwind CSS',
    'Node.js',
    'System Design',
    'Algorithms & Data Structures',
  ];

  filteredSkills = computed(() => {
    const search = this.searchTermSignal()?.toLowerCase()?.trim() ?? '';
    if (!search) return this.skills;
    return this.skills.filter((skill) => skill.toLowerCase().includes(search));
  });

  levels = [
    { value: 'beginner', label: 'Beginner', icon: 'sentiment_satisfied' },
    { value: 'intermediate', label: 'Intermediate', icon: 'trending_up' },
    { value: 'advanced', label: 'Advanced', icon: 'workspace_premium' },
  ];

  practiceWithOptions = [
    { value: 'peer', label: 'Another learner', description: 'Practice with a peer', icon: 'group' },
    {
      value: 'instructor',
      label: 'Instructor',
      description: 'Practice with expert',
      icon: 'school',
    },
  ];

  minDate: Date = new Date();

  // Signals for summary panel updates
  selectedSkill = signal<string | null>(null);
  selectedLevel = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedAvailableFrom = signal<string | null>('21:00');
  selectedAvailableUntil = signal<string | null>('00:00');
  selectedDuration = signal<number>(30);
  selectedPracticeWith = signal<string | null>('peer');

  constructor(private fb: FormBuilder) {
    this.meetingForm = this.fb.group({
      skill: ['', Validators.required],
      level: ['intermediate', Validators.required],
      date: [new Date(), Validators.required],
      availableFrom: ['21:00', Validators.required],
      availableUntil: ['00:00', Validators.required],
      duration: [30, [Validators.required, Validators.min(30), Validators.max(60)]],
      practiceWith: ['peer', Validators.required],
    });

    // Synchronize form value changes to signals for the summary card
    this.meetingForm.valueChanges.forEach((values) => {
      this.selectedSkill.set(values.skill);
      this.selectedLevel.set(values.level);
      this.selectedDate.set(values.date);
      this.selectedAvailableFrom.set(values.availableFrom);
      this.selectedAvailableUntil.set(values.availableUntil);
      this.selectedDuration.set(values.duration || 30);
      this.selectedPracticeWith.set(values.practiceWith);
    });
  }

  filterSkills(query: string) {
    this.searchTermSignal.set(query);
  }

  removeSkill() {
    this.meetingForm.patchValue({ skill: '' });
    this.selectedSkill.set(null);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate.set(event.value);
  }

  // Duration modifier logic (Max 60 mins, Min 15 mins)
  adjustDuration(amount: number) {
    const current = this.meetingForm.get('duration')?.value || 30;
    const updated = current + amount;
    if (updated >= 30 && updated <= 60) {
      this.meetingForm.patchValue({ duration: updated });
    }
  }

  availabilityLabel(): string {
    const from = this.selectedAvailableFrom();
    const until = this.selectedAvailableUntil();
    if (from && until) {
      return `${from} → ${until}`;
    }
    return 'Not specified';
  }

  selectedLevelLabel(): string {
    const found = this.levels.find((l) => l.value === this.selectedLevel());
    return found ? found.label : 'Not selected';
  }

  selectedDateLabel(): string {
    const date = this.selectedDate();
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  selectedDurationLabel(): string {
    return `${this.selectedDuration()} minutes`;
  }

  selectedPracticeWithLabel(): string {
    const found = this.practiceWithOptions.find((o) => o.value === this.selectedPracticeWith());
    return found ? found.label : 'Not specified';
  }

  canCreateMeeting(): boolean {
    return (
      this.meetingForm.valid && !!this.selectedAvailableFrom() && !!this.selectedAvailableUntil()
    );
  }

  resetForm() {
    this.meetingForm.reset({
      duration: 30,
      practiceWith: 'peer',
      date: new Date(),
      availableFrom: '21:00',
      availableUntil: '00:00',
    });
    this.searchTermSignal.set('');
  }

  createMeeting() {
    if (this.canCreateMeeting()) {
      const payload = {
        ...this.meetingForm.value,
        availability: {
          from: this.selectedAvailableFrom(),
          until: this.selectedAvailableUntil(),
        },
      };
      console.log('Meeting payload created:', payload);
    }
  }
}

