import { Experience, OnboardingStatus, Proficiency, Role } from './global-model';
import { Specialisation } from './specialistation-model';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhotoKey: string | undefined;
  identityProviderId: string;
  experience: Experience;
  onboardingStatus: OnboardingStatus;
  experienceYears: number | undefined;
  organizationName: string | undefined;
  organizationRole: string | undefined;
  userSpecialisations: UserSpecialisation[];
}

export interface UserSpecialisation {
  id: string;
  specialisation: Specialisation;
  proficiency: Proficiency;
}

export interface UserSpecialisationRequest {
  specialisationId: string;
  proficiency: Proficiency;
}

export interface OnboardUserRequest {
  specialisations: UserSpecialisationRequest[];
  experience: Experience;
  role: string;
  experienceYears: number | undefined;
  organizationName: string | undefined;
  organizationRole: string | undefined;
}
