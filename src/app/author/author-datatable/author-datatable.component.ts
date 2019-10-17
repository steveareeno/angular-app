import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../../services/app.service';
import { IAuthorModel } from '../../interfaces/author-interface';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../services/dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'author-datatable',
    templateUrl: './author-datatable.component.html',
    styleUrls: ['./author-datatable.component.css'],
})

export class AuthorDataTableComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;    

    constructor(private appService: AppService, private router: Router, private spinner: NgxSpinnerService, private dialogService: DialogService, 
        private toastr: ToastrService) {}
    
    displayedColumns: string[] = ["Edit","AuthorId", "FirstName", "LastName", "CompanyName", "Delete"];
    dataSource = new MatTableDataSource();
    selectedRow = <IAuthorModel> {};

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }
    
    addAuthor() {
        this.dialogService.openAuthorDialog('Add Author', 0).afterClosed().subscribe(resp => {
            console.log(resp);
            if(resp) {
              // maybe relaod the table if there are edits
              this.loadData();
            }
          });

    }

    // this is if you want to allow clicking the row to open the dialog
    // selectRow(row) {
    //     // stuff the selected row into the author model
    //     // could look to pass an object to the details to save on 
    //     // hitting the DB
    //     this.selectedRow = row;

    //     // for now, just pass the param
    //     // navigate to the details using just the id as a param
    //     //this.router.navigate(['/author-edit', this.selectedRow.AuthorId]);
    //     this.dialogService.openAuthorDialog('Edit Author', this.selectedRow.AuthorId).afterClosed().subscribe(resp => {
    //         console.log(resp);
    //         if(resp) {
    //             // maybe relaod the table if there are edits
    //             this.loadData();
    //         }
    //     });
    // }
    
    ngOnInit() {
        this.loadData();
    }    

    loadData() {
        this.spinner.show();
        this.appService.getAuthors().subscribe(
            data => {
                this.dataSource.data = data;
                this.spinner.hide();
            }
        );
      
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

  editOnClick(authorId: number) {
    console.log(authorId)
    this.dialogService.openAuthorDialog('Edit Author', authorId).afterClosed().subscribe(resp => {
        console.log(resp);
        if(resp) {
            // maybe relaod the table if there are edits
            this.loadData();
        }
    });
}

  onDeleteClick (authorId: number) {
    this.dialogService.openConfirmDialog('Delete Author', 'Delete this author?').afterClosed().subscribe(resp => {
      if(resp) {
        this.appService.deleteAuthor(authorId).subscribe(
          resp => {
            console.log(resp.status);
            this.loadData();
            this.toastr.success('Author was deleted!', 'Success!', { closeButton: true });
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