import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Observable } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CanComponentDeactivate } from '../../can-deactivate-guard.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('f') form: NgForm;
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  changesSaved: boolean = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '../../assets/images/default.png', []);
        return;
      }

      this.originalContact = this.contactService.getContact(id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group) {
        this.groupContacts = this.originalContact.group.slice();
      }
    });
  }

  onSubmit() {
    const value = this.form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.changesSaved = true;
    // TODO: Find a fix for the component not updating right after edit.
    // this.router.navigate(['../'], { relativeTo: this.route });
    this.router.navigate(['/contacts'], { relativeTo: this.route.root }); // Temporary workaround
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onDrop(contactDrop: CdkDragDrop<Contact>) {
    const selectedContact: Contact = contactDrop.item.data;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const contactGroup = this.contact.group ?? [];
    if (
      (this.form.value.name !== this.contact.name ||
        this.form.value.email !== this.contact.email ||
        this.form.value.phone !== this.contact.phone ||
        this.form.value.imageUrl !== this.contact.imageUrl ||
        JSON.stringify(this.groupContacts) !== JSON.stringify(contactGroup)) &&
      !this.changesSaved
    ) {
      return confirm('Do you want to discard your changes?');
    } else {
      return true;
    }
  }
}
