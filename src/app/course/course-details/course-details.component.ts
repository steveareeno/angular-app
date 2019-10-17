import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ICourseModel } from '../../interfaces/course-interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})

export class CourseDetailsComponent implements OnInit {

  courseForm: FormGroup; // create a new instance of the material form group
  course = <ICourseModel> {}; // create a new instance of the course model

  constructor(private appService: AppService, private http: HttpClient, private fb: FormBuilder, private activeRoute: ActivatedRoute, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {

    // use the active route to get the course Id to pass to the service api
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.appService.getCourse(params['id']).subscribe(
          data => {
            this.course = data;
            this.course.IsNew = false;
            this.courseForm = this.fb.group(this.course); 
            this.courseForm.disable();
          }, 
          error => {
            console.log(error.Error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
    });
  }

  editOnClick() {
    this.router.navigate(['/course-edit', this.course.CourseId]);
  }
}
