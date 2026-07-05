import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AiChat } from './ai-chat';

describe('AiChat', () => {
  let service: AiChat;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AiChat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
