import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages = [
    new Message('01', 'Subject Test 1', 'Sample text 1', 'anonymous'),
    new Message('02', 'Subject Test 2', 'Sample text 2', 'anonymous'),
    new Message('03', 'Subject Test 3', 'Sample text 3', 'anonymous'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
