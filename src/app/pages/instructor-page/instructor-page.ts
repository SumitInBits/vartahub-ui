import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

export interface Instructor {
  id: string;
  name: string;
  role: string;
  experience: string;
  skills: string[];
  rating: number;
  sessions: number;
  avatar: string;
  bio: string;
  availability: string;
}

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  selector: 'app-instructor',
  standalone: true,
  templateUrl: './instructor-page.html',
  styleUrls: ['./instructor-page.css'],
})
export class InstructorPage {
  // Reactive signals for filtering and modal state
  protected searchQuery = signal<string>('');
  protected selectedSkillFilter = signal<string | null>(null);
  protected selectedInstructor = signal<Instructor | null>(null);

  protected readonly popularSkills = [
    'Java',
    'Spring Boot',
    'Angular',
    'System Design',
    'Python',
    'AWS',
    'Microservices',
  ];

  protected readonly instructors: Instructor[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Senior Software Engineer',
      experience: '7+ years experience',
      skills: ['Java', 'Spring Boot', 'System Design'],
      rating: 4.9,
      sessions: 128,
      avatar: 'RS',
      bio: 'Ex-FAANG engineer specializing in backend architecture, high-throughput microservices, and rigorous system design mock interview preparation.',
      availability: 'Mon, Wed, Fri (6 PM - 9 PM)',
    },
    {
      id: '2',
      name: 'Priya Verma',
      role: 'Frontend Engineer',
      experience: '6+ years experience',
      skills: ['Angular', 'TypeScript', 'JavaScript'],
      rating: 4.8,
      sessions: 96,
      avatar: 'PV',
      bio: 'Passionate frontend mentor helping developers master modern Angular, RxJS state management, and clean component design patterns.',
      availability: 'Tue, Thu (7 PM - 10 PM)',
    },
    {
      id: '3',
      name: 'Amit Singh',
      role: 'Backend & Cloud Architect',
      experience: '8+ years experience',
      skills: ['Java', 'Microservices', 'AWS'],
      rating: 4.9,
      sessions: 154,
      avatar: 'AS',
      bio: 'Cloud architecture expert focused on scalable distributed systems, AWS deployment pipelines, and advanced Java concurrency.',
      availability: 'Weekends (10 AM - 2 PM)',
    },
    {
      id: '4',
      name: 'Neha Gupta',
      role: 'Data Scientist',
      experience: '5+ years experience',
      skills: ['Python', 'Machine Learning', 'Data Science'],
      rating: 4.7,
      sessions: 82,
      avatar: 'NG',
      bio: 'Data science practitioner specializing in machine learning algorithms, Python data stack, and algorithmic coding interview coaching.',
      availability: 'Mon - Thu (5 PM - 8 PM)',
    },
  ];

  // Computed signal for filtered instructors based on search box & skill chips
  protected filteredInstructors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const skillFilter = this.selectedSkillFilter();

    return this.instructors.filter((instructor) => {
      const matchesText =
        !query ||
        instructor.name.toLowerCase().includes(query) ||
        instructor.role.toLowerCase().includes(query) ||
        instructor.skills.some((s) => s.toLowerCase().includes(query));

      const matchesSkill = !skillFilter || instructor.skills.includes(skillFilter);

      return matchesText && matchesSkill;
    });
  });

  constructor(private router: Router) {}

  protected toggleSkillFilter(skill: string) {
    if (this.selectedSkillFilter() === skill) {
      this.selectedSkillFilter.set(null);
    } else {
      this.selectedSkillFilter.set(skill);
    }
  }

  protected viewDetails(instructor: Instructor) {
    this.selectedInstructor.set(instructor);
  }

  protected closeModal() {
    this.selectedInstructor.set(null);
  }

  protected bookSession(instructorName: string) {
    this.router.navigate(['/schedule'], { queryParams: { instructor: instructorName } });
  }
}
