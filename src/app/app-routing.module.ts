import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { MessageListComponent } from './messages/message-list/message-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { CanComponentDeactivateGuard } from './can-deactivate-guard.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  {
    path: 'documents',
    component: DocumentsComponent,
    children: [
      {
        path: 'new',
        component: DocumentEditComponent,
        canDeactivate: [CanComponentDeactivateGuard],
      },
      {
        path: ':id',
        component: DocumentDetailComponent,
      },
      {
        path: ':id/edit',
        component: DocumentEditComponent,
        canDeactivate: [CanComponentDeactivateGuard],
      },
    ],
  },
  { path: 'messages', component: MessageListComponent },
  {
    path: 'contacts',
    component: ContactsComponent,
    children: [
      {
        path: 'new',
        component: ContactEditComponent,
        canDeactivate: [CanComponentDeactivateGuard],
      },
      {
        path: ':id',
        component: ContactDetailComponent,
      },
      {
        path: ':id/edit',
        component: ContactEditComponent,
        canDeactivate: [CanComponentDeactivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
