import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contact } from '../../../../shared/interface/contact.interface';
import { ContactService } from '../../../data-access/contact.service';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})

export class ContactComponent implements OnInit, OnDestroy {

  userId: string = '';
  contact: Contact | undefined;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            this.userId = params.get('id') || '';
            this.contactService.selectContact(this.userId)
            return this.contactService.getContactById(this.userId);
          })
        ).subscribe((contact) => { this.contact = contact })
    );
  }

  handleFavorite():void {
    if (this.contact) {
      const newFavoriteStatus = !this.contact.favorite;
      this.subscription.add(
        this.contactService
          .updateContact(this.userId, { favorite: newFavoriteStatus })
          .subscribe({
            next: (updatedContact) => {
              this.contact = updatedContact;
              this.contact.favorite = newFavoriteStatus;
            },
            error: (err) => {
              console.error('Error updating contact:', err);
            },
          })
      )
    }
  }

  handleDelete() {
    if (this.contact && confirm(`Are you sure you want to delete ${this.contact.name} ${this.contact.lastname}?`)) {
      this.subscription.add(
        this.contactService.deleteContact(this.userId).subscribe({
          next: (contact) => {
            alert(`${contact.name} ${contact.lastname} has been deleted.`);
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Error deleting contact:', err);
          },
        })
      )
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
