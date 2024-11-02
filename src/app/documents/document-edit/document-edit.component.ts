import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';
import { CanComponentDeactivate } from '../../can-deactivate-guard.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})

export class DocumentEditComponent implements OnInit, CanComponentDeactivate {
  document: Document;
  id: string;
  nativeWindow: any;
  changesSaved = false;
  documentName: string;
  documentDescription: string;
  documentUrl: string;
  isNew = false;

  constructor(
    private documentService: DocumentService,
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
        this.document = new Document('', '', '', '', []);
        this.documentName = '';
        this.documentDescription = '';
        this.documentUrl = '';
      } else {
        this.route.params.subscribe((params: Params) => {
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
          if (this.document) {
            this.documentName = this.document.name;
            this.documentDescription = this.document.description;
            this.documentUrl = this.document.url;
          }
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onUpdateDocument() {
    this.documentService.updateDocument(
      this.document,
      new Document(
        '',
        this.documentName,
        this.documentDescription,
        this.documentUrl,
        []
      )
    );
    this.changesSaved = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCreateDocument() {
    this.documentService.addDocument(
      new Document(
        '',
        this.documentName,
        this.documentDescription,
        this.documentUrl,
        []
      )
    );
    this.documentName = '';
    this.documentDescription = '';
    this.documentUrl = '';
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.documentName !== this.document.name ||
        this.documentDescription !== this.document.description ||
        this.documentUrl !== this.document.url) &&
      !this.changesSaved
    ) {
      return confirm('Do you want to discard your changes?');
    } else {
      return true;
    }
  }
}
