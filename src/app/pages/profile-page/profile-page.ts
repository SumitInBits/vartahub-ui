import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

export type Experience = 'FRESHER' | 'EXPERIENCED';
export type OnboardingStatus = 'PENDING' | 'COMPLETED';
export type Proficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface SpecialisationDto {
  id: string;
  name: string;
  slug: string;
}

export interface UserSpecialisationDto {
  id: string;
  specialisation: SpecialisationDto;
  proficiency: Proficiency;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhotoKey?: string;
  identityProviderId?: string;
  role: string;
  experience: Experience;
  onboardingStatus: OnboardingStatus;
  experienceYears: number;
  organizationName: string;
  userSpecialisations: UserSpecialisationDto[];
}

@Component({
  imports: [MatIcon, MatButton],
  selector: 'app-profile-page',
  styleUrl: './profile-page.css',
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  protected readonly user = signal<UserDto>({
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    firstName: 'Alex',
    lastName: 'Johnson',
    username: 'alex_johnson',
    email: 'alex.johnson@example.com',
    role: 'Senior Full Stack Engineer',
    experience: 'EXPERIENCED',
    onboardingStatus: 'COMPLETED',
    experienceYears: 6,
    organizationName: 'Vartahub Technologies',
    userSpecialisations: [
      {
        id: 'spec-1',
        specialisation: { id: 's1', name: 'Java', slug: 'java' },
        proficiency: 'EXPERT',
      },
      {
        id: 'spec-2',
        specialisation: { id: 's2', name: 'Spring Boot', slug: 'spring-boot' },
        proficiency: 'ADVANCED',
      },
      {
        id: 'spec-3',
        specialisation: { id: 's3', name: 'System Design', slug: 'system-design' },
        proficiency: 'EXPERT',
      },
      {
        id: 'spec-4',
        specialisation: { id: 's4', name: 'Angular', slug: 'angular' },
        proficiency: 'ADVANCED',
      },
      {
        id: 'spec-5',
        specialisation: { id: 's5', name: 'Kubernetes', slug: 'kubernetes' },
        proficiency: 'INTERMEDIATE',
      },
    ],
  });

  protected getFullName(): string {
    return `${this.user().firstName} ${this.user().lastName}`;
  }

  protected getInitials(): string {
    return `${this.user().firstName.charAt(0)}${this.user().lastName.charAt(0)}`;
  }
}
