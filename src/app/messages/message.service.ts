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
    this.http
      .get('https://cms-andre-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });
          this.messageChangedEvent.next(this.messages.slice());
        },
        // error method
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

  storeMessages(messages: Message[]) {
    const messagesJSON = JSON.stringify(messages);

    this.http
      .put(
        'https://cms-andre-default-rtdb.firebaseio.com/messages.json',
        messagesJSON,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .subscribe(
        // success method
        (responseData) => {
          this.messageChangedEvent.next(
            JSON.parse(JSON.stringify(responseData))
          );
        },
        // error method
        (error: any) => {
          console.log(error);
        }
      );
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    this.maxMessageId++;
    message.id = `${this.maxMessageId}`;
    this.messages.push(message);
    this.storeMessages(this.messages.slice());
  }
}
