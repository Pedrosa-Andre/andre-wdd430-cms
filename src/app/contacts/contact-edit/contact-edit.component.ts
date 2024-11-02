import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { WindRefService } from '../../wind-ref.service';
import { CanComponentDeactivate } from '../../can-deactivate-guard.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})

export class ContactEditComponent implements OnInit, CanComponentDeactivate {
  contact: Contact;
  id: string;
  nativeWindow: any;
  changesSaved = false;
  contactName: string;
  contactImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  isNew = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private windRefService: WindRefService,
    private router: Router
  ) {}

  ngOnInit() {
    this.nativeWindow = this.windRefService.getNativeWindow();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'new') {
        this.isNew = true;
        this.contact = new Contact('', '', '', '', '../../assets/images/default.png', []);
        this.contactName = '';
        this.contactEmail = '';
        this.contactPhone = '';
        this.contactImageUrl = '../../assets/images/default.png';
      } else {
        this.route.params.subscribe((params: Params) => {
          this.id = params['id'];
          this.contact = this.contactService.getContact(this.id);
          if (this.contact) {
            this.contactName = this.contact.name;
            this.contactEmail = this.contact.email;
            this.contactPhone = this.contact.phone;
            this.contactImageUrl = this.contact.imageUrl;
          }
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onUpdateContact() {
    this.contactService.updateContact(
      this.contact,
      new Contact(
        '',
        this.contactName,
        this.contactEmail,
        this.contactPhone,
        this.contactImageUrl,
        []
      )
    );
    this.changesSaved = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCreateContact() {
    this.contactService.addContact(
      new Contact(
        '',
        this.contactName,
        this.contactEmail,
        this.contactPhone,
        this.contactImageUrl,
        []
      )
    );
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactImageUrl = '../../assets/images/default.png';
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.contactName !== this.contact.name ||
        this.contactEmail !== this.contact.email ||
        this.contactPhone !== this.contact.phone ||
        this.contactImageUrl !== this.contact.imageUrl) &&
      !this.changesSaved
    ) {
      return confirm('Do you want to discard your changes?');
    } else {
      return true;
    }
  }
}
