import { Component, Input } from '@angular/core';
import { Document } from './document.model';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  @Input() selectedDocument: Document;
}
