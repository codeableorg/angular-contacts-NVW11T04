import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './home/ui/components/contact/contact.component';
import { Error404Component } from './error404/error404.component';
import { ContactEditComponent } from './home/contact-edit/contact-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'contact/create',
        component: ContactEditComponent
      },
      {
        path: 'contact/:id',
        component: ContactComponent,
      },
      {
        path: 'contact/:id/edit',
        component: ContactEditComponent,
      },
    ],
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
