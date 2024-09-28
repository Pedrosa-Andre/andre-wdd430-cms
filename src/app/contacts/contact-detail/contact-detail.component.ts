import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html'
})
export class ContactDetailComponent {
  contact!: Contact

  // contact = new Contact(
  //   '1',
  //   'R. Kent Jackson',
  //   'jacksonk@byui.edu',
  //   '208-496-3771',
  //   '../../assets/images/jacksonk.jpg',
  //   null
  // )
}