import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorDetailsComponent } from './author/author-details/author-details.component';
import { AuthorDataTableComponent } from './author/author-datatable/author-datatable.component'; 
import { CourseDetailsComponent } from './course/course-details/course-details.component';
import { CourseEditComponent } from './course/course-edit/course-edit.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { CourseDataTableComponent } from './course/course-datatable/course-datatable.component'; 
import { CompanyDataTableComponent } from './company/company-datatable/company-datatable.component'; 
import { HomeComponent } from './home/home.component'
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'course/:id', component: CourseDetailsComponent },    // details 
  { path: 'course-edit/:id', component: CourseEditComponent },  // edit
  { path: 'course-edit', component: CourseEditComponent },      // add
  { path: 'course-datatable', component: CourseDataTableComponent },
  { path: 'author/:id', component: AuthorDetailsComponent },
  { path: 'author-datatable', component: AuthorDataTableComponent },
  { path: 'company-datatable', component: CompanyDataTableComponent },
  { path: 'company-edit/:id', component: CompanyEditComponent },
  { path: 'company-edit', component: CompanyEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
