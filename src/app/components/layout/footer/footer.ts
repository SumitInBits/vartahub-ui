import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  // Reactive live clock signal using toSignal
  protected readonly liveTime = toSignal(
    interval(1000).pipe(
      startWith(0),
      map(() =>
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      ),
    ),
    { initialValue: '' },
  );

  protected readonly platformLinks = [
    { label: 'Skill-based Matching', route: '/schedule' },
    { label: 'Real Interview Practice', route: '/schedule' },
    { label: 'Learn from Instructors', route: '/home' },
    { label: 'Dashboard', route: '/home' },
  ];

  protected readonly legalLinks = [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Interview Guidelines', path: '#' },
    { label: 'Cookie Settings', path: '#' },
  ];
}
