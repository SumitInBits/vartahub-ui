import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InstructorProfileDialog } from '../instructor-page/instructor-profile-dialog';
import { AuthContext } from '../../services/auth/auth-context';
import { IamService } from '../../services/api/iam-service';
import { StorageService } from '../../services/storage/storage-service';
import { OnboardingForm } from '../../components/onboarding-form/onboarding-form';
import { OnboardingStatusDto } from '../../models/user-model';
import { OnboardingStatus } from '../../models/global-model';

interface Instructor {
  name: string;
  role: string;
  experience: string;
  skills: string[];
  rating: number;
  sessions: number;
  avatar: string;
}

interface PracticeMode {
  icon: string;
  title: string;
  description: string;
  action: string;
  route: string;
  highlighted?: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private dialog = inject(MatDialog);
  private readonly onboardingStatusKey = 'onboardingStatus';
  private readonly authContext = inject(AuthContext);
  private readonly iamService = inject(IamService);
  private readonly storageService = inject(StorageService);

  openProfile(instructor: Instructor): void {
    this.dialog.open(InstructorProfileDialog, {
      width: 'min(92vw, 520px)',
      maxWidth: '100vw',
      data: instructor,
    });
  }

  constructor() {
    effect(() => {
      this.checkOnboardingStatus();
    });
  }

  protected readonly practiceModes: PracticeMode[] = [
    {
      icon: 'groups',
      title: 'Peer Interview',
      description:
        'Practice with another candidate who has similar skills and compatible availability.',
      action: 'Find a peer',
      route: '/schedule-meeting',
      highlighted: true,
    },
    {
      icon: 'school',
      title: 'Instructor',
      description:
        'Learn and practice with experienced instructors who can guide you through real interviews.',
      action: 'Find an instructor',
      route: '/instructor',
    },
    {
      icon: 'smart_toy',
      title: 'AI Interview',
      description:
        'Start an interview instantly with AI and practice whenever you want, without waiting for a match.',
      action: 'Practice with AI',
      route: '/ai-interview',
    },
  ];

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

  checkOnboardingStatus() {
    const onboardingStatus = this.storageService.get<OnboardingStatusDto>(this.onboardingStatusKey);
    if (onboardingStatus) {
      const isSameUser = onboardingStatus.keycloakId === this.authContext.getId();
      console.log(isSameUser)
      if (isSameUser) {
        // If it's completed for the same user, do nothing and stop here
        if (onboardingStatus.onboardingStatus === OnboardingStatus.COMPLETED) {
          return;
        }

        // If it's PENDING in localStorage for the same user, trigger the dialog immediately!
        if (onboardingStatus.onboardingStatus === OnboardingStatus.PENDING) {
          this.openOnboardingDialog();
          return; // Skip the redundant API call
        }
      } else {
        // User changed, clear storage
        this.storageService.remove(this.onboardingStatusKey);
      }
    }

    // Fallback: If not in storage or user changed, fetch from backend
    if (this.authContext.authenticated()) {
      this.iamService.getOnboardingStatus().subscribe((statusResponse) => {
        if (statusResponse.onboardingStatus  === OnboardingStatus.PENDING) {
          this.openOnboardingDialog();
        }
        this.storageService.set<OnboardingStatusDto>(this.onboardingStatusKey, statusResponse);
      });
    }
  }

  private openOnboardingDialog() {
    this.dialog.open(OnboardingForm, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
    });
  }
}
