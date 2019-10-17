import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../../services/app.service';
import { ICompanyModel } from '../../interfaces/company-interface';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'company-datatable',
    templateUrl: './company-datatable.component.html',
    styleUrls: ['./company-datatable.component.css'],
})

export class CompanyDataTableComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;    

    constructor(private appService: AppService, private router: Router, private spinner: NgxSpinnerService) {}
    
    displayedColumns: string[] = ["CompanyId", "CompanyName"];
    dataSource = new MatTableDataSource();
    selectedRow = <ICompanyModel> {};

    ngOnInit() {
        this.spinner.show();
        this.appService.getCompanys().subscribe(
            data => {
                this.dataSource.data = data;
                this.spinner.hide();
           }
        );
      
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
        this.router.navigate(['/company-edit', this.selectedRow.CompanyId]);
    }
} 