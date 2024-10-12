import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter();

  documents: Document[] = [
    new Document('1', 'Name 1', 'Description 1', 'url 1', null),
    new Document('2', 'Name 2', 'Description 2', 'url 2', null),
    new Document('3', 'Name 3', 'Description 3', 'url 3', null),
    new Document('4', 'Name 4', 'Description 4', 'url 4', null),
    new Document('5', 'Name 5', 'Description 5', 'url 5', null),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
