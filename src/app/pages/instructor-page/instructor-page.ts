import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InstructorProfileDialog } from './instructor-profile-dialog';

export interface Instructor {
  id: string;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  experienceYears: number;
  skills: string[];
  rating: number;
  sessions: number;
  avatar: string;
  bio: string;
}

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './instructor-page.html',
  styleUrl: './instructor-page.css',
})
export class InstructorPage {
  protected readonly searchQuery = signal('');
  protected readonly selectedExperience = signal('Any experience');
  protected readonly currentPage = signal(1);

  protected readonly pageSize = 6;

  protected readonly instructors: Instructor[] = [
    {
      id: 'rahul-sharma',
      name: 'Rahul Sharma',
      role: 'Senior Backend Engineer',
      specialization: 'Java & Spring Boot',
      experience: '8+ years',
      experienceYears: 8,
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'System Design'],
      rating: 4.9,
      sessions: 342,
      avatar: 'RS',
      bio: 'Senior backend engineer helping developers master Java, Spring Boot, APIs, microservices and scalable system design.',
    },
    {
      id: 'priya-verma',
      name: 'Priya Verma',
      role: 'Senior Frontend Engineer',
      specialization: 'Angular & TypeScript',
      experience: '7+ years',
      experienceYears: 7,
      skills: ['Angular', 'TypeScript', 'RxJS', 'JavaScript', 'Frontend Architecture'],
      rating: 4.9,
      sessions: 286,
      avatar: 'PV',
      bio: 'Frontend specialist focused on Angular, TypeScript, scalable UI architecture and frontend interview preparation.',
    },
    {
      id: 'amit-singh',
      name: 'Amit Singh',
      role: 'Staff Software Engineer',
      specialization: 'System Design',
      experience: '10+ years',
      experienceYears: 10,
      skills: ['System Design', 'Distributed Systems', 'AWS', 'Java', 'Architecture'],
      rating: 5.0,
      sessions: 418,
      avatar: 'AS',
      bio: 'Staff engineer helping candidates prepare for senior-level system design and software engineering interviews.',
    },
    {
      id: 'neha-gupta',
      name: 'Neha Gupta',
      role: 'Machine Learning Engineer',
      specialization: 'Python & Machine Learning',
      experience: '6+ years',
      experienceYears: 6,
      skills: ['Python', 'Machine Learning', 'SQL', 'Data Science', 'TensorFlow'],
      rating: 4.8,
      sessions: 231,
      avatar: 'NG',
      bio: 'Machine learning engineer helping candidates strengthen Python, ML concepts, SQL and data science interviews.',
    },
    {
      id: 'vikas-mehta',
      name: 'Vikas Mehta',
      role: 'DevOps Engineer',
      specialization: 'Cloud & DevOps',
      experience: '8+ years',
      experienceYears: 8,
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
      rating: 4.8,
      sessions: 198,
      avatar: 'VM',
      bio: 'DevOps engineer specializing in cloud infrastructure, Kubernetes, CI/CD and production engineering.',
    },
    {
      id: 'sneha-kapoor',
      name: 'Sneha Kapoor',
      role: 'Full Stack Developer',
      specialization: 'React & Node.js',
      experience: '6+ years',
      experienceYears: 6,
      skills: ['React', 'Node.js', 'JavaScript', 'REST APIs', 'MongoDB'],
      rating: 4.7,
      sessions: 176,
      avatar: 'SK',
      bio: 'Full stack developer helping candidates improve JavaScript, React, backend APIs and full stack interview skills.',
    },
    {
      id: 'rohit-jain',
      name: 'Rohit Jain',
      role: 'Data Scientist',
      specialization: 'Data Science & SQL',
      experience: '5+ years',
      experienceYears: 5,
      skills: ['Python', 'SQL', 'Pandas', 'Statistics', 'Machine Learning'],
      rating: 4.8,
      sessions: 154,
      avatar: 'RJ',
      bio: 'Data scientist focused on practical data science, SQL, statistics and machine learning interview preparation.',
    },
    {
      id: 'ananya-iyer',
      name: 'Ananya Iyer',
      role: 'Software Engineer',
      specialization: 'DSA & Coding Interviews',
      experience: '5+ years',
      experienceYears: 5,
      skills: ['DSA', 'C++', 'Java', 'Problem Solving', 'Algorithms'],
      rating: 4.9,
      sessions: 267,
      avatar: 'AI',
      bio: 'Software engineer helping candidates build strong problem-solving skills and prepare for coding interviews.',
    },
  ];

  protected readonly experienceOptions = [
    'Any experience',
    '3+ years',
    '5+ years',
    '7+ years',
    '10+ years',
  ];

  protected readonly filteredInstructors = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const experience = this.selectedExperience();

    return this.instructors.filter((instructor) => {
      const matchesSkill =
        !query ||
        instructor.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        instructor.specialization.toLowerCase().includes(query);

      const matchesExperience =
        experience === 'Any experience' ||
        this.matchesExperience(instructor.experienceYears, experience);

      return matchesSkill && matchesExperience;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredInstructors().length / this.pageSize),
  );

  protected readonly paginatedInstructors = computed(() => {
    const instructors = this.filteredInstructors();
    const start = (this.currentPage() - 1) * this.pageSize;

    return instructors.slice(start, start + this.pageSize);
  });

  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  constructor(private readonly dialog: MatDialog) {}

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  protected resetFilters(): void {
    this.searchQuery.set('');
    this.selectedExperience.set('Any experience');
    this.currentPage.set(1);
  }

  protected openProfile(instructor: Instructor): void {
    this.dialog.open(InstructorProfileDialog, {
      data: instructor,
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'instructor-profile-dialog',
    });
  }

  protected changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  protected previousPage(): void {
    this.changePage(this.currentPage() - 1);
  }

  protected nextPage(): void {
    this.changePage(this.currentPage() + 1);
  }

  private matchesExperience(years: number, option: string): boolean {
    const minimumYears = Number.parseInt(option, 10);

    return years >= minimumYears;
  }
}
