import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { CanComponentDeactivate } from '../../can-deactivate-guard.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})
export class DocumentEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('f') form: NgForm;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  changesSaved = false;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        this.document = new Document('', '', '', '', []);
        return;
      }

      this.originalDocument = this.documentService.getDocument(id);
      if (!this.originalDocument) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onSubmit() {
    const value = this.form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url,
      []
    );
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.changesSaved = true;
    // TODO: Find a fix for the component not updating right after edit.
    // this.router.navigate(['../'], { relativeTo: this.route });
    this.router.navigate(['/documents'], { relativeTo: this.route.root }); // Temporary workaround
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.form.value.name !== this.document.name ||
        this.form.value.description !== this.document.description ||
        this.form.value.url !== this.document.url) &&
      !this.changesSaved
    ) {
      return confirm('Do you want to discard your changes?');
    } else {
      return true;
    }
  }
}
