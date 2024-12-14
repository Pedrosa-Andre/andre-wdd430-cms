import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Contact } from './contact.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new Subject<Contact>();
  contactChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let contact of this.contacts) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getContacts(): Contact[] {
    this.http.get('http://localhost:3000/contacts').subscribe(
      (responseData: {
        resMessage: string;
        contacts?: Contact[];
        error?: string;
      }) => {
        this.contacts = responseData.contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          if (+a.id < +b.id) return -1;
          if (+a.id > +b.id) return 1;
          return 0;
        });
        this.contactChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    this.http.delete(`http://localhost:3000/contacts/${contact.id}`).subscribe(
      () => {
        // Remove from local cache only on success
        this.contacts = this.contacts.filter((doc) => doc.id !== contact.id);
        this.contactChangedEvent.next(this.contacts.slice());
        console.log('Contact deleted successfully');
      },
      (error: any) => {
        console.error('Error deleting contact', error);
      }
    );
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = `${this.maxContactId}`;

    this.http.post('http://localhost:3000/contacts', newContact).subscribe(
      (responseData: {
        resMessage: string;
        contact?: Contact;
        error?: string;
      }) => {
        this.contacts.push(responseData.contact);
        this.contactChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error adding contact', error);
      }
    );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    newContact.id = originalContact.id;

    this.http
      .put(`http://localhost:3000/contacts/${originalContact.id}`, newContact)
      .subscribe(
        (responseData: {
          resMessage: string;
          contact?: Contact;
          error?: string;
        }) => {
          const pos = this.contacts.findIndex(
            (doc) => doc.id === originalContact.id
          );
          if (pos >= 0) {
            this.contacts[pos] = responseData.contact;
            this.contactChangedEvent.next(this.contacts.slice());
          }
        },
        (error: any) => {
          console.error('Error updating contact', error);
        }
      );
  }
}
