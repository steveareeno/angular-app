import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { IAuthorModel } from '../../interfaces/author-interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-author-edit',
  templateUrl: './author-edit.component.html',
  styleUrls: ['./author-edit.component.css']
})

export class AuthorEditComponent implements OnInit {

  authorForm: FormGroup; // create a new instance of the material form group
  author = <IAuthorModel> {}; // create a new instance of the author model

  constructor(private appService: AppService, private http: HttpClient, 
    private fb: FormBuilder, private activeRoute: ActivatedRoute, 
    private toastr: ToastrService, private router: Router, private dialogService: DialogService) {}

  ngOnInit() {

    // use the active route to get the author Id to pass to the service api
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.appService.getAuthor(params['id']).subscribe(
          data => {
            this.author = data;
            this.author.IsNew = false;
            this.authorForm = this.fb.group({
              AuthorId: this.author.AuthorId,
              FirstName: [this.author.FirstName, [Validators.required, Validators.minLength(2)]],
              LastName: [this.author.LastName, [Validators.required, Validators.minLength(2)]],
              CompanyId: [this.author.CompanyId, [Validators.required]],
              IsNew: false,
            });
            this.authorForm.disable();
          }, 
          error => {
            console.log(error.Error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
      else {
        this.authorForm = this.fb.group({
          AuthorId: 0,
          FirstName: ['', [Validators.required, Validators.minLength(2)]],
          LastName: ['', [Validators.required, Validators.minLength(2)]],
          CompanyId: [0, [Validators.required]],
          IsNew: true,
        })
      }
    });

    // this will track all the chnages made to the authorform. 
    // Check the console as you type values in the controls
    // only seems to work if the controls are empty (new item)
    if (this.authorForm) {
      this.authorForm.valueChanges.subscribe((value) => {
        console.log(value);
      });
    }
  }

  onSubmit() {
    if (this.authorForm.valid) {
      this.author = this.authorForm.value;
      if (this.authorForm.value.IsNew) {
        this.appService.postAuthor(this.author).subscribe(
          resp => {
            console.log(resp.body.id);
            this.toastr.success('Author was saved!', 'Success!', { closeButton: true });
            this.authorForm.disable();
            // this.router.navigate(['/author', resp.body.id]);
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      } else {
        this.appService.putAuthor(this.author).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Author was saved!', 'Success!', { closeButton: true });
            this.authorForm.disable();
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
    }
    else {
      return;
    }
  }

  editOnClick() {
    this.authorForm.enable();
  }
  onCancelEditClick() {
    this.authorForm.disable();
  }

  onDeleteClick () {
    this.dialogService.openConfirmDialog('Delete Author', 'Delete this author?').afterClosed().subscribe(resp => {
      if(resp) {
        this.appService.deleteAuthor(this.author.AuthorId).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Author was deleted!', 'Success!', { closeButton: true });
            this.router.navigate(['/author-datatable']);
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
