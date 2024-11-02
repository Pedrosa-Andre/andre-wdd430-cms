import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @Input() selectedDocument: Document;
  private subscription: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.subscription =
      this.documentService.documentListSelectedEvent.subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
