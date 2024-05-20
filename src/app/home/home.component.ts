import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SearchContactComponent } from './ui/components/search-contact/search-contact.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HttpClientModule, ContactEditComponent, SearchContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
  showWelcomeMessage: boolean = false;

  constructor(private router: Router){};

  ngOnInit(): void {
    this.checkRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.checkRoute());
  }

  private checkRoute(){
    this.showWelcomeMessage = this.router.url === '/';
  }
}
