import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AIChatServe } from '../../services/ai-chat';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss'
})
export class AiChat {
  private aiChatService=inject(AIChatServe)
  userMessage = '';
  messages= signal<Message[]>([]);
  loading = signal<boolean>(false);

  constructor() {}

  async send() {
    if (!this.userMessage.trim() || this.loading()) return;

    // User message add karo
    this.messages().push({ role: 'user', text: this.userMessage });
    const prompt = this.userMessage;
    this.userMessage = '';
    this.loading.set(true);

    // Empty AI message add karo — isme chunks append honge
    this.messages().push({ role: 'ai', text: '' });
    const aiIndex = this.messages.length - 1;

    await this.aiChatService.streamMessage(
      prompt,
      (chunk) => {
        this.messages()[aiIndex].text += chunk;
      },
      () => {
        this.loading.set(false);
      }
    );
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}