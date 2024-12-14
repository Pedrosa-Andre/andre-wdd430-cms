import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let message of this.messages) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getMessages(): Message[] {
    this.http.get('http://localhost:3000/messages').subscribe(
      (responseData: { message: string; messages?: Message[]; error?: string }) => {
        this.messages = responseData.messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => {
          if (+a.id < +b.id) return -1;
          if (+a.id > +b.id) return 1;
          return 0;
        });
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    this.maxMessageId++;
    newMessage.id = `${this.maxMessageId}`;

    this.http
      .post('http://localhost:3000/messages', newMessage)
      .subscribe(
        (responseData: { data: string; message?: Message; error?: string }) => {
          this.messages.push(responseData.message);
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error adding message', error);
        }
      );
  }
}
