import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultLayout } from './layout/default-layout';

@Component({
  selector: 'app-root',
  imports: [DefaultLayout],
  template: '<app-default-layout />',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ang-contrato-espaco');
}
