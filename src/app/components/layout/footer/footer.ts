import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer{
  protected readonly currentYear = new Date().getFullYear();

  protected readonly platformLinks = [
    { label: 'Peer Interviews', route: '/schedule-meeting', },
    { label: 'AI Interviews', route: '/ai-interview', },
    { label: 'Instructors', route: '/instructor', },
    { label: 'Dashboard', route: '/home', },
  ];

  protected readonly supportLinks = [
    { label: 'About Vartahub', route: '/about', },
    { label: 'Contact Us', route: '/contact', },
    { label: 'FAQ & Help Center', route: '/help', },
    { label: 'Instructor Portal', route: '/instructor', },
  ];

  protected readonly legalLinks = [
    { label: 'Privacy Policy', route: '/privacy-policy', },
    { label: 'Terms of Service', route: '/terms', },
    { label: 'Interview Guidelines', route: '/interview-guidelines', },
    { label: 'Cookie Settings', route: '/cookie-settings', },
  ];
}
