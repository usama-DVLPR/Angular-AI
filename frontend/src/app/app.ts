import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChat } from './components/ai-chat/ai-chat';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet,AiChat],
})
export class App {
  protected readonly title = signal('frontend');
}
