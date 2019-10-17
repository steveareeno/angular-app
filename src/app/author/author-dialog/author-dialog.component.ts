import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { IAuthorModel } from '../../interfaces/author-interface';
import { ICompanyModel } from '../../interfaces/company-interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.css']
})
export class AuthorDialogComponent implements OnInit {

  authorForm: FormGroup; // create a new instance of the material form group
  author = <IAuthorModel> {}; // create a new instance of the author model
  //companies = <ICompanyModel[]>[];
  companies = <any>[];

  constructor(@Inject(MAT_DIALOG_DATA) public data, private appService: AppService,  
              private fb: FormBuilder, public dialogRef: MatDialogRef<AuthorDialogComponent>, private toastr: ToastrService) { }

  ngOnInit() {
      if(this.data.id) {
        // get the company data for the drop down
        this.appService.getCompanys().subscribe(
          companyData => {
            this.companies = companyData;
            // console.log(companyData)
          }, 
          error => {
            console.log(error.Error);
          }
        );
       
        this.appService.getAuthor(this.data.id).subscribe(
          authorData => {
            this.author = authorData;
            // console.log(authorData)
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

    // this will track all the chnages made to the authorform. 
    // Check the console as you type values in the controls
    // only seems to work if the controls are empty (new item)
    // if (this.authorForm) {
    //   this.authorForm.valueChanges.subscribe((value) => {
    //     console.log(value);
    //   });
    // }
  }

  editOnClick() {
    this.authorForm.enable();
  }
  
  onCancelEditClick() {
    this.authorForm.disable();
  }
  // this function is for setting the selected value in the
  // CompanyId select list. not sure how this works, but it does.
  // it is referenced in the mat-select element using: [compareWith]="compareFn"
  compareFn(o1: any, o2: any): boolean {
    return o1 === o2 && o1 === o2;
  }
  
  onSubmit() {
    if (this.authorForm.valid) {
      this.author = this.authorForm.value;
      if (this.authorForm.value.IsNew) {
        this.appService.postAuthor(this.author).subscribe(
          resp => {
            // console.log(resp.body.id);
            this.dialogRef.close(true);
            this.toastr.success("Author was saved", 'Success!');
          },
          error => {
            console.log("Error", error);
          }
        );
      } else {
        this.appService.putAuthor(this.author).subscribe(
          resp => {
            console.log(resp.status);
            this.dialogRef.close(true);
            this.toastr.success("Author was saved", 'Success!');
          },
          error => {
            console.log("Error", error);
          }
        );
      }
    }
    else {
      this.validateAllFormFields(this.authorForm);
    }
  }

  // this is necessary to validate and empty form (new record)
  // becasue the logic in the view is checking if the control
  // is dirty or touched. NewSince the form is empty, we have to
  // check the controls values and force them as touched to
  // trigger the validation
  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}