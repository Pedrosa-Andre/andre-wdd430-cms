import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit, OnDestroy {
  @Input() selectedContact: Contact;
  private subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription = this.contactService.contactSelectedEvent.subscribe(
      (contact: Contact) => {
        this.selectedContact = contact;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
