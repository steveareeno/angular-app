import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { LayoutModule } from '@angular/cdk/layout';
import { AppNavComponent } from './app-nav/app-nav.component';
import { AuthorDetailsComponent } from './author/author-details/author-details.component';
import { AuthorDialogComponent } from './author/author-dialog/author-dialog.component';
import { AuthorDataTableComponent } from './author/author-datatable/author-datatable.component'; 
import { CourseDetailsComponent } from './course/course-details/course-details.component';
import { CourseEditComponent } from './course/course-edit/course-edit.component';
import { CourseDataTableComponent } from './course/course-datatable/course-datatable.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CompanyDataTableComponent } from './company/company-datatable/company-datatable.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    AuthorDetailsComponent,
    AuthorDataTableComponent,
    AuthorDialogComponent,
    CourseDetailsComponent,
    CourseEditComponent,
    CourseDataTableComponent,
    HomeComponent,
    ConfirmDialogComponent,
    CompanyDataTableComponent,
    CompanyEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, LayoutModule, MatToolbarModule, MatCheckboxModule, MatButtonModule, 
    MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatDialogModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent], // bootstrap: the start up component
  entryComponents: [ConfirmDialogComponent, AuthorDialogComponent] // entryComponents: for dynamically loaded components
})
export class AppModule { }
