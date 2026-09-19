import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';

import { Navbar } from './components/layout/navbar/navbar';

@Component({
  imports: [Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('VartaHub');
}
