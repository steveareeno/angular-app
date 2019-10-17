import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../../services/app.service';
import { ICourseModel } from '../../interfaces/course-interface';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'course-datatable',
    templateUrl: './course-datatable.component.html',
    styleUrls: ['./course-datatable.component.css'],
})

export class CourseDataTableComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;    

    constructor(private appService: AppService, private router: Router, private spinner: NgxSpinnerService, private toastr:ToastrService) {}
    
    displayedColumns: string[] = ["CourseId", "AuthorName", "Title", "CourseLength", "Category", "CourseDate"];
    dataSource = new MatTableDataSource();
    selectedRow = <ICourseModel> {};

    ngOnInit() {
        /** spinner starts on init */
        this.spinner.show();
        this.appService.getCourses().subscribe(
            data => {
                this.dataSource.data = data;
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.spinner.hide();
                }, 2000);
                //this.spinner.hide();
           }, 
           error => {
            console.log(error);
            this.toastr.error(error, 'Error', {
                closeButton: true,
                timeOut: 5000, // milliseconds
                enableHtml: true, // allows html in the message
                tapToDismiss: true, // click toastr to close
            });
            this.spinner.hide();
 
          },
          () => {
            // No errors
          }        
          );
      
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }    

    ngAfterViewInit() {
        // sort 
        // this.dataSource.sortingDataAccessor = (item, property) => {
        //     switch (property) {
        //         case 'CourseDate': return new Date(item.CourseDate);
        //         default: return item[property];
        //     }
        // };
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }
    
    selectRow(row) {
        // stuff the selected row into the course model
        // could look to pass an object to the details to save on 
        // hitting the DB
        this.selectedRow = row;

        // for now, just pass the param
        // navigate to the details using just the id as a param
        this.router.navigate(['/course-edit', this.selectedRow.CourseId]);
    }
} 