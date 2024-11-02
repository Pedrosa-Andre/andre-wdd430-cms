import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private subscription: Subscription;

  constructor(private documentsService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentsService.getDocuments();
    this.subscription =
      this.documentsService.documentListChangedEvent.subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
