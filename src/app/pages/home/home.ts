import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

interface Instructor {
  name: string;
  role: string;
  experience: string;
  skills: string[];
  rating: number;
  sessions: number;
  avatar: string;
}

interface UpcomingMeeting {
  title: string;
  type: 'peer' | 'instructor';
  participant: string;
  date: string;
  time: string;
  skills: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly instructors: Instructor[] = [
    {
      name: 'Rahul Sharma',
      role: 'Senior Software Engineer',
      experience: '7+ years experience',
      skills: ['Java', 'Spring Boot', 'System Design'],
      rating: 4.9,
      sessions: 128,
      avatar: 'RS',
    },
    {
      name: 'Priya Verma',
      role: 'Frontend Engineer',
      experience: '6+ years experience',
      skills: ['Angular', 'TypeScript', 'JavaScript'],
      rating: 4.8,
      sessions: 96,
      avatar: 'PV',
    },
    {
      name: 'Amit Singh',
      role: 'Backend Engineer',
      experience: '8+ years experience',
      skills: ['Java', 'Microservices', 'AWS'],
      rating: 4.9,
      sessions: 154,
      avatar: 'AS',
    },
    {
      name: 'Neha Gupta',
      role: 'Data Scientist',
      experience: '5+ years experience',
      skills: ['Python', 'Machine Learning', 'Data Science'],
      rating: 4.7,
      sessions: 82,
      avatar: 'NG',
    },
  ];

  protected readonly upcomingMeetings: UpcomingMeeting[] = [
    {
      title: 'Java Interview Practice',
      type: 'peer',
      participant: 'Waiting for matched candidate',
      date: 'Tomorrow',
      time: '10:30 AM',
      skills: ['Java', 'Spring Boot'],
    },
    {
      title: 'System Design Session',
      type: 'instructor',
      participant: 'Rahul Sharma',
      date: 'Sep 03',
      time: '06:00 PM',
      skills: ['System Design'],
    },
  ];

  constructor(private router: Router) {}

  protected createMeeting(): void {
    this.router.navigate(['/schedule']);
  }

  protected findInstructor(): void {
    console.log('Find instructor');
  }

  protected exploreInstructors(): void {
    console.log('Explore instructors');
  }

  protected viewMeeting(meeting: UpcomingMeeting): void {
    console.log('View meeting:', meeting);
  }

  protected getMeetingIcon(type: UpcomingMeeting['type']): string {
    return type === 'instructor' ? 'person' : 'people';
  }
}
