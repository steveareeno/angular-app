import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ICourseModel } from '../../interfaces/course-interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { IAuthorModel } from '../../interfaces/author-interface';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})

export class CourseEditComponent implements OnInit {

  courseForm: FormGroup; // create a new instance of the material form group
  course = <ICourseModel> {}; // create a new instance of the course model
  authors = <any>[]; // empty array for the author typeahead
  selectedAuthor = <IAuthorModel> {}; // create a new instance of the course model

  constructor(private appService: AppService, private http: HttpClient, private fb: FormBuilder, 
    private activeRoute: ActivatedRoute, private toastr: ToastrService, private router: Router, private dialogService: DialogService) {}

  ngOnInit() {
      // this code will track all the changes made to the courseform. 
      // this.courseForm.valueChanges.subscribe((value) => {
      //   console.log(value);
      // });

      // use the active route to get the course Id url param to pass to the service api
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        // get the data from the api and populate the course form
        this.appService.getCourse(params['id']).subscribe(
          data => {
            this.course = data;
            this.courseForm = this.fb.group({
              CourseId: this.course.CourseId,
              AuthorId: [this.course.AuthorId, [Validators.required]],
              Title: [this.course.Title, [Validators.required, Validators.minLength(4)]],
              CourseDate: [this.course.CourseDate, [Validators.required]],
              Category: [this.course.Category, [Validators.required, Validators.minLength(2)]],
              CourseLength: [this.course.CourseLength, [Validators.required, Validators.minLength(2)]],
              IsNew: false,
              IsEdit: false,
            });
            this.setAuthorTypeahead();
            // get the data for the author type ahead and set the selected author
            this.appService.getAuthor(this.course.AuthorId).subscribe(            
              authorData => { this.selectedAuthor = authorData; }
            );        
          }, 
          error => {
            console.log(error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
      else {
        this.courseForm = this.fb.group({
          CourseId: 0,
          AuthorId:  [null, [Validators.required]],
          Title:  ['', [Validators.required, Validators.minLength(4)]],
          CourseDate: ['', [Validators.required]],
          Category: ['', [Validators.required, Validators.minLength(4)]],
          CourseLength:  ['', [Validators.required, Validators.minLength(2)]],
          IsNew: true,
          IsEdit: false,
    });
        this.setAuthorTypeahead();
      }
    });
  }

  getSelectedAuthor (id) {
    this.appService.getAuthor(id).subscribe(
      authorData => {
        this.selectedAuthor = authorData;
        this.selectedAuthor.FirstName + " " + this.selectedAuthor.LastName;
      }, 
      error => {
        console.log(error.Error);
      }
    );        
  }


  // for the author typeahead control
  setAuthorTypeahead () {
    if (this.courseForm) {
      this.courseForm.controls.AuthorId.valueChanges.subscribe(
        term => {
          if (term != '') {
            this.appService.searchAuthors(term).subscribe(
              data => {
                this.authors = data as any[];
            });
          }
      });
    }

    // if you want to use async in the view:
    // if (this.courseForm) {
    // this.authors = this.courseForm 
    //   .get('AuthorId') 
    //   .valueChanges 
    //   .pipe( 
    //     debounceTime(300), 
    //     switchMap(value => this.appService.searchAuthors(value)) 
    //   ); 
    // }
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.course = this.courseForm.value;
      if (this.courseForm.value.IsNew) {
        this.appService.postCourse(this.course).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Course was saved!', 'Success!', { closeButton: true });
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      } else {
        this.appService.putCourse(this.course).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Course was saved!', 'Success!', { closeButton: true });
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
      this.courseForm.controls.IsEdit.setValue(false);
      this.courseForm.controls.IsNew.setValue(false);
    }
  }

  displayFn(id) {
    return this.selectedAuthor.FirstName + " " + this.selectedAuthor.LastName;
  }

  editOnClick() {
    this.courseForm.controls.IsEdit.setValue(true);
    this.courseForm.controls.IsNew.setValue(false);
  }
  onCancelEditClick() {
    this.courseForm.controls.IsEdit.setValue(false);
    this.courseForm.controls.IsNew.setValue(false);
  }
  onDeleteClick () {
    this.dialogService.openConfirmDialog('Delete Course', 'Delete this course?').afterClosed().subscribe(resp => {
      if(resp) {
        this.appService.deleteCourse(this.course.CourseId).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Course was deleted!', 'Success!', { closeButton: true });
            this.router.navigate(['/course-datatable']);
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
    });
  }
}
