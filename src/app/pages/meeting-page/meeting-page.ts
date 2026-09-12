import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MeetingDetailsDialog } from './meeting-details-dialog/meeting-details-dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';



export interface Meeting {
  id: number;
  title: string;
  instructor: string;
  instructorRole: string;
  avatar: string;
  date: string;
  time: string;
  duration: string;
  type: 'Peer Interview' | 'Instructor Session';
  status: 'upcoming' | 'completed';
  skills: string[];
  createdAt: string;
  meetingUrl?: string;
  feedback?: {
    submitted: boolean;
    rating?: number;
    comment?: string;
  };
}


@Component({
  imports: [MatButtonModule, MatIconModule, RouterLink, MatPaginator],
  selector: 'app-meeting-page',
  styleUrl: './meeting-page.css',
  templateUrl: './meeting-page.html',
})
export class MeetingPage {
  private readonly dialog = inject(MatDialog);
  protected currentPage = 0;
  protected currentPageSize = 5;
  protected onPastMeetingsPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.currentPageSize = event.pageSize;
  }
  protected get paginatedPastMeetings(): Meeting[] {
    const startIndex = this.currentPage * this.currentPageSize;
    const endIndex = startIndex + this.currentPageSize;
    return this.pastMeetings.slice(startIndex, endIndex);
  }
  protected openMeetingDetails(meeting: Meeting): void {
    this.dialog.open(MeetingDetailsDialog, {
      width: '640px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      autoFocus: false,
      data: meeting,
    });
  }
  protected readonly upcomingMeetings: Meeting[] = [
    {
      id: 1,
      title: 'Mock Interview',
      instructor: 'Rahul Sharma',
      instructorRole: 'Senior Software Engineer',
      avatar: 'RS',
      date: 'Tomorrow',
      time: '10:30 AM',
      duration: '45 min',
      type: 'Instructor Session',
      status: 'upcoming',
      skills: ['Java', 'Spring Boot'],
      createdAt: 'Sep 12, 2026, 10:32 AM',
      meetingUrl: '#',
    },
    {
      id: 2,
      title: 'Peer Interview Practice',
      instructor: 'Amit Kumar',
      instructorRole: 'Software Engineer',
      avatar: 'AK',
      date: 'Sep 12, 2026',
      time: '4:00 PM',
      duration: '60 min',
      type: 'Peer Interview',
      status: 'upcoming',
      skills: ['JavaScript', 'React'],
      createdAt: 'Sep 10, 2026, 2:15 PM',
      meetingUrl: '#',
    },
  ];

  protected readonly pastMeetings: Meeting[] = [
    {
      id: 3,
      title: 'System Design Interview',
      instructor: 'Rahul Sharma',
      instructorRole: 'Senior Software Engineer',
      avatar: 'RS',
      date: 'Sep 5, 2026',
      time: '4:00 PM',
      duration: '60 min',
      type: 'Instructor Session',
      status: 'completed',
      skills: ['System Design', 'Java', 'Spring Boot'],
      createdAt: 'Sep 3, 2026, 11:20 AM',
      feedback: {
        submitted: true,
        rating: 5,
        comment: 'Excellent session. The feedback on system design was very helpful.',
      },
    },
    {
      id: 4,
      title: 'Frontend Interview Practice',
      instructor: 'Priya Verma',
      instructorRole: 'Frontend Engineer',
      avatar: 'PV',
      date: 'Aug 28, 2026',
      time: '11:00 AM',
      duration: '45 min',
      type: 'Instructor Session',
      status: 'completed',
      skills: ['JavaScript', 'React'],
      createdAt: 'Sep 10, 2026, 2:15 PM',
      feedback: {
        submitted: false,
      },
    },
    {
      id: 5,
      title: 'Java & Spring Boot Practice',
      instructor: 'Amit Singh',
      instructorRole: 'Backend Engineer',
      avatar: 'AS',
      date: 'Aug 20, 2026',
      time: '3:30 PM',
      duration: '60 min',
      type: 'Peer Interview',
      status: 'completed',
      skills: ['JavaScript', 'React'],
      createdAt: 'Sep 10, 2026, 2:15 PM',
      feedback: {
        submitted: true,
        rating: 4,
        comment: 'Good practice session with useful discussion around Spring Boot.',
      },
    },
  ];
}
