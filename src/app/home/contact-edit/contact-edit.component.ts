import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contact } from '../../shared/interface/contact.interface';
import { Subscription, of, switchMap } from 'rxjs';
import { ContactService } from '../data-access/contact.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IdGeneratorService } from '../../shared/services/id-generator.service';
import { UsernameValidatorDirective } from '../directives/username-validator.directive';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, UsernameValidatorDirective],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
  providers: [IdGeneratorService],
})
export class ContactEditComponent implements OnInit, OnDestroy {
  userId: string = '';
  contact: Contact | undefined;
  formContactData: Contact = {} as Contact;
  submitText: string = 'Save';
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private idGeneratorService: IdGeneratorService,
    private location: Location
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            this.userId = params.get('id') || '';
            if (this.userId)
              return this.contactService.getContactById(this.userId);
            return of({} as Contact);
          })
        )
        .subscribe((contact) => {
          this.contact = contact;
          if (this.contact) this.formContactData = { ...this.contact };
        })
    );

    this.submitText = this.router.url.includes('create') ? 'Create' : 'Save';
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.userId) {
        this.contactService
          .updateContact(this.userId, this.formContactData)
          .subscribe();
        this.router.navigate(['/contact', this.userId]);
      } else {
        const newUser = {
          ...this.formContactData,
          id: this.generateNewUserId(
            this.formContactData.name,
            this.formContactData.lastname
          ),
        };
        this.contactService.createContact(newUser).subscribe({
          next: (user) => {
            this.router.navigate(['/contact', user.id]);
          },
        });
      }
    }
  }

  generateNewUserId(name: string, lastname: string): string {
    return `${name.trim().toLowerCase()}-${lastname
      .trim()
      .toLowerCase()}-${this.idGeneratorService.generateRandomID(4)}`;
  }

  handleCancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
