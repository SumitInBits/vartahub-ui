import { Component, computed, inject } from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-onboarding-form',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
  ],
  styleUrl: './onboarding-form.css',
  templateUrl: './onboarding-form.html',
})
export class OnboardingForm {
}
