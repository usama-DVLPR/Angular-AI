import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class AIChatServe {
  private http = inject(HttpClient);
  private base_url=environment.apiUrl
  sendMessage(message: string) {
    return this.http.post<ChatResponse>(`${this.base_url}/chat`, { message });
  }

  async streamMessage(
    message:string,
    onChunk: (text:string) => void,
    onDone: ()=> void
  ):Promise<void>{
    const response= await fetch(`${this.base_url}/stream/chat`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })

    });
    const reader =response.body!.getReader()
    const decoder =new TextDecoder()
     while (true) {
      const { done, value } = await reader.read();
      if (done) { onDone(); break; }
      onChunk(decoder.decode(value));
    }
  }

}
