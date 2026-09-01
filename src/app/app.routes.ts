import { Routes } from '@angular/router';
import { Registration } from './pages/registration/registration';
import { Home } from './pages/home/home';
import { Schedule} from './pages/schedule-meeting/schedule';
import { InstructorPage } from './pages/instructor-page/instructor-page';
import { ConferenceRoom} from './pages/conference-room/conference-room';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'registration', component: Registration },
  { path: 'schedule', component: Schedule },
  { path: 'instructor', component: InstructorPage},
  { path: 'conference', component: ConferenceRoom },
];
