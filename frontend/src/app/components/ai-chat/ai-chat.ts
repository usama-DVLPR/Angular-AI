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

    const prompt = this.userMessage;
    this.userMessage = '';
    this.loading.set(true);

    // User message aur empty AI message (chunks isme append honge) add karo
    this.messages.update(msgs => [...msgs, { role: 'user', text: prompt }, { role: 'ai', text: '' }]);
    const aiIndex = this.messages().length - 1;

    // Chunks jitni bhi tezi se aayen, typing effect ke liye ek fixed pace par
    // character-by-character reveal karo, taake network se decouple rahe.
    let buffer = '';
    let streamDone = false;
    let typing = false;

    const appendChar = (char: string) => {
      this.messages.update(msgs => {
        const updated = [...msgs];
        updated[aiIndex] = { ...updated[aiIndex], text: updated[aiIndex].text + char };
        return updated;
      });
    };

    const typeNextChar = () => {
      if (buffer.length === 0) {
        typing = false;
        if (streamDone) this.loading.set(false);
        return;
      }
      appendChar(buffer[0]);
      buffer = buffer.slice(1);
      setTimeout(typeNextChar, 15);
    };

    await this.aiChatService.streamMessage(
      prompt,
      (chunk) => {
        buffer += chunk;
        if (!typing) {
          typing = true;
          typeNextChar();
        }
      },
      () => {
        streamDone = true;
        if (buffer.length === 0) this.loading.set(false);
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