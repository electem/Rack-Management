import { AppComponent } from './app.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { TemplateDetailsComponent } from './components/template-details/template-details.component';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddFormComponent } from './components/add-form/add-forms.component';
import { EditFormsComponent } from './components/edit-forms/edit-forms.component';
import { FormListComponent } from './components/forms-list/forms-list.component';
import { CreateRackComponent } from './components/create-rack/create-rack.component';
import { RackListComponent } from './components/rack-list/rack-list.component';
import { EditRackComponent } from './components/edit-rack/edit-rack.component';

const routes: Routes = [
  { path: '', component: LoginComponent , pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'template', component: TemplateListComponent },
  { path: 'template/:id', component: TemplateDetailsComponent },
  { path: 'add', component: AddTemplateComponent },
  { path: 'addTemplate', component: EditAppComponent },
  { path: 'edit/:id', component: EditFormComponent },
  { path: 'edit/:name/:id', component: EditFormComponent},
  { path: 'addForm', component: AddFormComponent },
  { path: 'addForm/:id', component: AddFormComponent},
  { path: 'addForm/:name/:id', component: AddFormComponent},
  { path: 'EditForm/:name/:id', component: EditFormsComponent },
  { path: 'form', component: FormListComponent },
  { path: 'form/:name/:id', component: FormListComponent },
  { path: 'menu/:id', component: AppComponent },
  { path: 'menu/:name/:id', component: FormListComponent},
  { path: 'createRack', component: CreateRackComponent},
  { path: 'rackList', component:RackListComponent},
  { path: 'editRack/:id', component:EditRackComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
