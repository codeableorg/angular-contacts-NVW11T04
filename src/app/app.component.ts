import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ContactService } from './home/data-access/contact.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ContactService]
})

export class AppComponent {
  title = 'contacts-app-angular';
}
