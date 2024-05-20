import { RouterModule } from '@angular/router';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../data-access/contact.service';
import { Contact } from '../../../../shared/interface/contact.interface';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-search-contact',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './search-contact.component.html',
  styleUrl: './search-contact.component.css',
})
export class SearchContactComponent implements OnInit, OnDestroy {
  public contacts: Contact[] = [];
  public selectedContactId: null | string = null;
  private searchTerms = new BehaviorSubject<string>('');
  isCreating: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.subscription.add(this.setupSearchSubscription());
    this.subscription.add(this.setupContactsSubscription());
    this.subscription.add(this.setupSelectedContactSubscription());
  }

  private setupSearchSubscription(): Subscription {
    return this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.contactService.searchContact(term);
          return this.contactService.contacts$;
        })
      )
      .subscribe((contacts) => (this.contacts = contacts));
  }

  private setupContactsSubscription(): Subscription {
    return this.contactService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  private setupSelectedContactSubscription(): Subscription {
    return this.contactService.selectedContactId$.subscribe((contactId) => {
      this.selectedContactId = contactId;
      if (contactId) {
        this.scrollToContact(contactId);
      }
    });
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchTerms.next(inputElement.value.trim());
    }
  }

  selectedContact(contactId: string): void {
    this.selectedContactId = contactId;
    this.contactService.selectContact(contactId);
  }

  private scrollToContact(contactId: string): void {
    setTimeout(() => {
      const element = this.elRef.nativeElement.querySelector(`#contact-${contactId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
