import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentsService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentsService.getDocuments();
  }

  onSelectedDocument(document: Document) {
    this.documentsService.documentSelectedEvent.emit(document);
  }
}
