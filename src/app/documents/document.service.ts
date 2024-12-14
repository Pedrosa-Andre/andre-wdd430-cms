import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Document } from './document.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentListSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getDocuments(): Document[] {
    this.http.get('http://localhost:3000/documents').subscribe(
      (responseData: { resMessage: string; documents?: Document[]; error?: string }) => {
        this.documents = responseData.documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (+a.id < +b.id) return -1;
          if (+a.id > +b.id) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    this.http
      .delete(`http://localhost:3000/documents/${document.id}`)
      .subscribe(
        () => {
          // Remove from local cache only on success
          this.documents = this.documents.filter(
            (doc) => doc.id !== document.id
          );
          this.documentListChangedEvent.next(this.documents.slice());
          console.log('Document deleted successfully');
        },
        (error: any) => {
          console.error('Error deleting document', error);
        }
      );
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = `${this.maxDocumentId}`;

    this.http
      .post('http://localhost:3000/documents', newDocument)
      .subscribe(
        (responseData: { resMessage: string; document?: Document; error?: string }) => {
          this.documents.push(responseData.document);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error adding document', error);
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    newDocument.id = originalDocument.id;

    this.http
      .put(
        `http://localhost:3000/documents/${originalDocument.id}`,
        newDocument
      )
      .subscribe(
        (responseData: { resMessage: string; document?: Document; error?: string }) => {
          const pos = this.documents.findIndex(
            (doc) => doc.id === originalDocument.id
          );
          if (pos >= 0) {
            this.documents[pos] = responseData.document;
            this.documentListChangedEvent.next(this.documents.slice());
          }
        },
        (error: any) => {
          console.error('Error updating document', error);
        }
      );
  }
}
