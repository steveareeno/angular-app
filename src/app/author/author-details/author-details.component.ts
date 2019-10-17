import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { IAuthorModel } from '../../interfaces/author-interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.css']
})

export class AuthorDetailsComponent implements OnInit {

  authorForm: FormGroup; // create a new instance of the material form group
  author = <IAuthorModel> {}; // create a new instance of the author model

  constructor(private appService: AppService, private http: HttpClient, private fb: FormBuilder, private activeRoute: ActivatedRoute, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {

    // use the active route to get the author Id to pass to the service api
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.appService.getAuthor(params['id']).subscribe(
          data => {
            this.author = data;
            this.author.IsNew = false;
            this.authorForm = this.fb.group(this.author); 
            this.authorForm.disable();
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
    this.router.navigate(['/author-edit', this.author.AuthorId]);
  }
}
