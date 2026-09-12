import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  instructorCount: number;
}

export interface InstructorOverview {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization: string;
  experience: string;
  rating: number;
  status: 'Active' | 'Pending';
}

export interface SessionItem {
  id: string;
  studentName: string;
  instructorName: string;
  topic: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule,
    MatPaginatorModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  // New skill input model
  protected newSkillName = signal('');
  protected newSkillCategory = signal('Backend');

  // Pagination states
  protected readonly skillPageIndex = signal(0);
  protected readonly skillPageSize = signal(4);

  protected readonly instructorPageIndex = signal(0);
  protected readonly instructorPageSize = signal(4);

  protected readonly sessionPageIndex = signal(0);
  protected readonly sessionPageSize = signal(4);

  // Skills & Specializations State
  protected readonly skills = signal<SkillItem[]>([
    { id: '1', name: 'Angular', category: 'Frontend', instructorCount: 4 },
    { id: '2', name: 'Spring Boot', category: 'Backend', instructorCount: 3 },
    { id: '3', name: 'System Design', category: 'Architecture', instructorCount: 5 },
    { id: '4', name: 'Python & ML', category: 'Data Science', instructorCount: 2 },
    { id: '5', name: 'Kubernetes & DevOps', category: 'DevOps', instructorCount: 2 },
    { id: '6', name: 'React', category: 'Frontend', instructorCount: 3 },
    { id: '7', name: 'TypeScript', category: 'Frontend', instructorCount: 5 },
    { id: '8', name: 'Node.js', category: 'Backend', instructorCount: 4 },
  ]);

  // Instructor Overview State
  protected readonly instructors = signal<InstructorOverview[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.s@vartahub.com',
      role: 'Senior Backend Engineer',
      specialization: 'Java & Spring Boot',
      experience: '8+ years',
      rating: 4.9,
      status: 'Active',
    },
    {
      id: '2',
      name: 'Priya Verma',
      email: 'priya.v@vartahub.com',
      role: 'Senior Frontend Engineer',
      specialization: 'Angular & TypeScript',
      experience: '7+ years',
      rating: 4.9,
      status: 'Active',
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit.s@vartahub.com',
      role: 'Staff Software Engineer',
      specialization: 'System Design',
      experience: '10+ years',
      rating: 5.0,
      status: 'Active',
    },
    {
      id: '4',
      name: 'Neha Gupta',
      email: 'neha.g@vartahub.com',
      role: 'ML Engineer',
      specialization: 'Python & Machine Learning',
      experience: '6+ years',
      rating: 4.8,
      status: 'Active',
    },
    {
      id: '5',
      name: 'Vikas Mehta',
      email: 'vikas.m@vartahub.com',
      role: 'DevOps Specialist',
      specialization: 'Cloud & DevOps',
      experience: '8+ years',
      rating: 4.8,
      status: 'Active',
    },
    {
      id: '6',
      name: 'Sneha Kapoor',
      email: 'sneha.k@vartahub.com',
      role: 'Full Stack Developer',
      specialization: 'React & Node.js',
      experience: '6+ years',
      rating: 4.7,
      status: 'Active',
    },
    {
      id: '7',
      name: 'Rohit Jain',
      email: 'rohit.j@vartahub.com',
      role: 'Data Scientist',
      specialization: 'Data Science & SQL',
      experience: '5+ years',
      rating: 4.8,
      status: 'Active',
    },
  ]);

  // Session & Booking Monitor State
  protected readonly sessions = signal<SessionItem[]>([
    {
      id: 's1',
      studentName: 'Aarav Patel',
      instructorName: 'Rahul Sharma',
      topic: 'Spring Boot Microservices Architecture',
      date: 'Sep 15, 2026 - 4:00 PM',
      status: 'Upcoming',
    },
    {
      id: 's2',
      studentName: 'Rohan Gupta',
      instructorName: 'Priya Verma',
      topic: 'Angular RxJS State Management',
      date: 'Sep 14, 2026 - 2:00 PM',
      status: 'Upcoming',
    },
    {
      id: 's3',
      studentName: 'Ananya Sharma',
      instructorName: 'Amit Singh',
      topic: 'System Design Mock Interview',
      date: 'Sep 12, 2026 - 11:00 AM',
      status: 'Completed',
    },
    {
      id: 's4',
      studentName: 'Karan Malhotra',
      instructorName: 'Neha Gupta',
      topic: 'Machine Learning Pipelines with Python',
      date: 'Sep 10, 2026 - 6:00 PM',
      status: 'Completed',
    },
    {
      id: 's5',
      studentName: 'Meera Iyer',
      instructorName: 'Vikas Mehta',
      topic: 'Kubernetes Cluster Deployment',
      date: 'Sep 08, 2026 - 5:00 PM',
      status: 'Cancelled',
    },
    {
      id: 's6',
      studentName: 'Kabir Das',
      instructorName: 'Sneha Kapoor',
      topic: 'React Performance Optimization',
      date: 'Sep 06, 2026 - 3:00 PM',
      status: 'Completed',
    },
  ]);

  // Computed paginated data
  protected readonly paginatedSkills = computed(() => {
    const list = this.skills();
    const start = this.skillPageIndex() * this.skillPageSize();
    return list.slice(start, start + this.skillPageSize());
  });

  protected readonly paginatedInstructors = computed(() => {
    const list = this.instructors();
    const start = this.instructorPageIndex() * this.instructorPageSize();
    return list.slice(start, start + this.instructorPageSize());
  });

  protected readonly paginatedSessions = computed(() => {
    const list = this.sessions();
    const start = this.sessionPageIndex() * this.sessionPageSize();
    return list.slice(start, start + this.sessionPageSize());
  });

  protected displayedSkillColumns: string[] = ['name', 'category', 'instructorCount', 'actions'];
  protected displayedInstructorColumns: string[] = [
    'name',
    'role',
    'specialization',
    'experience',
    'rating',
    'status',
    'actions',
  ];
  protected displayedSessionColumns: string[] = [
    'student',
    'instructor',
    'topic',
    'date',
    'status',
    'actions',
  ];

  // Add skill handler
  protected addSkill(): void {
    const name = this.newSkillName().trim();
    if (!name) return;

    const newEntry: SkillItem = {
      id: Date.now().toString(),
      name,
      category: this.newSkillCategory(),
      instructorCount: 0,
    };

    this.skills.update((list) => [newEntry, ...list]);
    this.skillPageIndex.set(0);
    this.newSkillName.set('');
  }

  // Remove skill handler
  protected removeSkill(id: string): void {
    this.skills.update((list) => list.filter((item) => item.id !== id));
  }

  // Toggle instructor status simulation
  protected toggleInstructorStatus(id: string): void {
    this.instructors.update((list) =>
      list.map((inst) =>
        inst.id === id
          ? { ...inst, status: inst.status === 'Active' ? 'Pending' : 'Active' }
          : inst,
      ),
    );
  }

  // Cancel/Update session status
  protected cancelSession(id: string): void {
    this.sessions.update((list) =>
      list.map((session) => (session.id === id ? { ...session, status: 'Cancelled' } : session)),
    );
  }

  // Paginator events
  protected onSkillPageChange(event: PageEvent): void {
    this.skillPageIndex.set(event.pageIndex);
    this.skillPageSize.set(event.pageSize);
  }

  protected onInstructorPageChange(event: PageEvent): void {
    this.instructorPageIndex.set(event.pageIndex);
    this.instructorPageSize.set(event.pageSize);
  }

  protected onSessionPageChange(event: PageEvent): void {
    this.sessionPageIndex.set(event.pageIndex);
    this.sessionPageSize.set(event.pageSize);
  }
}
