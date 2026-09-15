import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  selector: 'app-forbidden-page',
  styleUrl: './forbidden-page.css',
  templateUrl: './forbidden-page.html',
})
export class ForbiddenPage {
  goBack(): void {
    window.history.back();
  }
}
