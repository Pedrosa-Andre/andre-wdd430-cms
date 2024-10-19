import { Component, Input, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  @Input() selectedContact: Contact;

  constructor(private contactService: ContactService) {}

 ngOnInit() {
   this.contactService.contactSelectedEvent.subscribe(
    (contact: Contact) => {
      this.selectedContact = contact;
    }
   )
 }
}
