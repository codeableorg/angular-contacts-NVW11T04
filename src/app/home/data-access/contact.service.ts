import { Injectable } from '@angular/core';
import { Contact } from '../../shared/interface/contact.interface';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl: string = environments.baseUrl;
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private selectedContactIdSubject = new BehaviorSubject<string | null>(null);

  contacts$ = this.contactsSubject.asObservable();
  selectedContactId$ = this.selectedContactIdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialContacts();
  }

  private loadInitialContacts(): void {
    this.getContacts().subscribe({
      next: contacts => this.contactsSubject.next(contacts),
      error: err => console.error('Failed to load all contacts', err)
    });
  }
  getContacts():Observable<Contact[]>{
    return this.http.get<Contact[]>(`${this.baseUrl}/contacts?_sort=name`).pipe(
      catchError(this.handleError<Contact[]>(`Failed to get the list of contacts`, []))
    )
  }

  searchContactByName(query: string): Observable<Contact[]>{
    return this.http.get<Contact[]>(`${this.baseUrl}/contacts?_sort=name`)
      .pipe(
        map((contacts) => contacts.filter(({name, lastname}) => {
          const fullname = `${name} ${lastname}`;
          return fullname.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        })),
        catchError(this.handleError<Contact[]>('Failed to search a contact by name', []))
      )
  }

  searchContact(term: string): void{
    if(term === '') {
      this.loadInitialContacts()
    } else {
      this.searchContactByName(term).subscribe({
        next: contacts => this.contactsSubject.next(contacts),
        error: err => console.error('Failed to seach contacts', err)
      });
    }
  }

  getContactById(id: string):Observable<Contact | undefined>{
    return this.http.get<Contact>(`${this.baseUrl}/contacts/${id}`).pipe(
      catchError(this.handleError<Contact>(`Failed to find a contact with the id=${id}`))
    );
  }

  createContact(body: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.baseUrl}/contacts`, body).pipe(
      tap(() => { this.loadInitialContacts()}),
      catchError(this.handleError<Contact>('Failed to create a new contact'))
    );
  }

  updateContact(id: string, body: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${this.baseUrl}/contacts/${id}`, body).pipe(
      tap(() => { this.loadInitialContacts()}),
      catchError(this.handleError<Contact>(`Failed to update the contact with the id=${id}`))
    )
  }

  deleteContact(id: string):Observable<Contact>{
    return this.http.delete<Contact>(`${this.baseUrl}/contacts/${id}`).pipe(
      tap(() => {
        this.loadInitialContacts()
      }),
      catchError(this.handleError<Contact>(`Failed to delete the contact with the id=${id}`))
    );
  }

  selectContact(contactId: string): void {
    this.selectedContactIdSubject.next(contactId);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation}: ${error.message}`);
      return of(result as T);
    };
  }
}
