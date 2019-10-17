import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ICompanyModel } from '../../interfaces/company-interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css']
})

export class CompanyEditComponent implements OnInit {

  companyForm: FormGroup; // create a new instance of the material form group
  company = <ICompanyModel> {}; // create a new instance of the company model
  authors = <any>[]; // empty array for the author typeahead

  constructor(private appService: AppService, private http: HttpClient, private fb: FormBuilder, 
    private activeRoute: ActivatedRoute, private toastr: ToastrService, private router: Router, private dialogService: DialogService) {}

  ngOnInit() {
    // use the active route to get the company Id param to pass to the service api
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.appService.getCompany(params['id']).subscribe(
          data => {
            this.company = data;
            this.companyForm = this.fb.group({
              CompanyId: this.company.CompanyId,
              CompanyName: [this.company.CompanyName,[Validators.required, Validators.minLength(2)]],
              IsNew: false,
              IsEdit: false,
            });
            this.companyForm.disable();
          }, 
          error => {
            console.log(error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
      else {
        this.companyForm = this.fb.group({
          CompanyId: 0,
          CompanyName: ['',[Validators.required, Validators.minLength(2)]],
          IsNew: true,
          IsEdit: false,
        });
      }
    });
  }
     // for the author typeahead control
  onSubmit() {
    if (this.companyForm.valid) {
      this.company = this.companyForm.value;
      if (this.companyForm.value.IsNew) {
        this.appService.postCompany(this.company).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Company was saved!', 'Success!', { closeButton: true });
            this.router.navigate(['/company-edit', resp.body.id]);
            this.companyForm.disable();
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      } else {
        this.appService.putCompany(this.company).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Company was saved!', 'Success!', { closeButton: true });
            this.companyForm.disable();
          },
          error => {
            console.log("Error", error);
            this.toastr.error(error.Error, 'Error!');
          }
        );
      }
      this.companyForm.controls.IsEdit.setValue(false);
      this.companyForm.controls.IsNew.setValue(false);
    }
  }

  editOnClick() {
    this.companyForm.controls.IsEdit.setValue(true);
    this.companyForm.controls.IsNew.setValue(false);
  }
  onCancelEditClick() {
    this.companyForm.controls.IsEdit.setValue(false);
    this.companyForm.controls.IsNew.setValue(false);
  }

  onDeleteClick () {
    this.dialogService.openConfirmDialog('Delete Company', 'Delete this company?').afterClosed().subscribe(resp => {
      if(resp) {
        this.appService.deleteCompany(this.company.CompanyId).subscribe(
          resp => {
            console.log(resp.status);
            this.toastr.success('Company was deleted!', 'Success!', { closeButton: true });
            this.router.navigate(['/company-datatable']);
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
