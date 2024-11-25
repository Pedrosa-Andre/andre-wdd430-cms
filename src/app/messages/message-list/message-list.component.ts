import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages = [];
  private subscription: Subscription;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getContacts();
    this.messages = this.messageService.getMessages();
    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
