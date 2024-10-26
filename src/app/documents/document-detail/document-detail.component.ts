import { Component } from '@angular/core';
import { Document } from '../document.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
})
export class DocumentDetailComponent {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private windRefService: WindRefService,
    private router: Router
  ) {}

  ngOnInit() {
    this.nativeWindow = this.windRefService.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.document = this.documentService.getDocument(this.id);
    });
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigateByUrl('/documents');
  }
}
