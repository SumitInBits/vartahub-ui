import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialisation, SpecialisationRequest } from '../models/specialistation-model';
import { Page } from '../models/global-model';
import { OnboardUserRequest, User } from '../models/user-model';

@Service()
export class IamService {
  private readonly baseApi = '/api/vartahub/iam/v1';
  private readonly httpClient = inject(HttpClient);

  getSpecialisations(page: number = 0, size: number = 10): Observable<Page<Specialisation>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.httpClient.get<Page<Specialisation>>(`${this.baseApi}/specialisations`, { params });
  }

  createSpecialisations(specialisationsRequest: SpecialisationRequest): Observable<string> {
    return this.httpClient.post<string>(`${this.baseApi}/specialisations`, specialisationsRequest);
  }

  deleteSpecialisation(specialisationId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseApi}/specialisations/${specialisationId}`);
  }

  getUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.baseApi}/users`);
  }

  onboardUser(completeCreateUserRequest: OnboardUserRequest): Observable<string> {
    return this.httpClient.post<string>(`${this.baseApi}/users/onboard`, completeCreateUserRequest);
  }
}
