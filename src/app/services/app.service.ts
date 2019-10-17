import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ICourseModel } from '../interfaces/course-interface';
import { IAuthorModel } from '../interfaces/author-interface';
import { ICompanyModel } from '../interfaces/company-interface';
import { Observable } from 'rxjs';
import { catchError, defaultIfEmpty } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { map } from 'rxjs/operators';

/********************************
  a service class for making
  webapi calls to a data source 
  
********************************/ 

//  RxJS has many operators for observables:
//  https://rxjs-dev.firebaseapp.com/guide/operators

// constants must be before decorators (@Injectable, for example)
const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root'
})

export class AppService {
  
  private baseUrl = 'https://j00qaddin01.courts.state.mn.us/CoursesWebApi/api';
  private courseUrl = '/Courses';
  private authorUrl = '/Authors';
  private companyUrl = '/Companies';
  
  // error handler
  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
        console.error('Client Side Error:', errorResponse.message);
    } else {
        console.error('Server Side Error:', errorResponse.message);
    }
    
    // return an observable with a meaningful error message to the end user
    return throwError({'Error': errorResponse.message });
  }


  constructor(private http: HttpClient) { }

  /******************* COURSES API ***********************/

  getCourses(): Observable<ICourseModel[]> {
    return this.http.get<ICourseModel[]>(`${this.baseUrl + this.courseUrl}`).pipe(catchError(this.handleError))
  }

  // the api doesn't appear to have a get course
  getCourse(id: number): Observable<ICourseModel> {
    return this.http.get<ICourseModel>(`${this.baseUrl + this.courseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  postCourse(course: ICourseModel): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.baseUrl + this.courseUrl}/`,  JSON.stringify(course), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  putCourse(course: ICourseModel): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.baseUrl + this.courseUrl}/${course.CourseId}`, JSON.stringify(course), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  deleteCourse(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl + this.courseUrl}/${id}`, {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }
  /******************* AUTHORS API ***********************/

  getAuthors(): Observable<IAuthorModel[]> {
    return this.http.get<IAuthorModel[]>(`${this.baseUrl + this.authorUrl}`)
  }

  // the api doesn't appear to have a get course
  getAuthor(id: number): Observable<IAuthorModel> {
    return this.http.get<IAuthorModel>(`${this.baseUrl + this.authorUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  postAuthor(author: IAuthorModel): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.baseUrl + this.authorUrl}/`, JSON.stringify(author), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  putAuthor(author: IAuthorModel): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.baseUrl + this.authorUrl}/${author.AuthorId}`, JSON.stringify(author), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  deleteAuthor(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl + this.authorUrl}/${id}`, {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  searchAuthors(term: string) {
    var emptyAuthor = [{AuthorId: 0, FirstName: "No results...", LastName: "", CompanyId: 0, CompanyName: ""}];
    var listOfAuthors = this.http.get<IAuthorModel>(`${this.baseUrl + this.authorUrl + "/Search"}/${term}`)
        .pipe(
          debounceTime(500),  // WAIT FOR 500 MILISECONDS AFTER EACH KEY STROKE.
          // defaultIfEmpty(emptyAuthor as any), // this doesn't return anything
          map(
            (data: any) => {
              return (
                data.length != 0 ? data : emptyAuthor
              );
            }
          )
        );
    
    listOfAuthors.forEach(author => {
      console.log(author); 
    })

    return listOfAuthors;  
  }  

  /******************* COMPANY API ***********************/

  getCompanys(): Observable<ICompanyModel[]> {
    return this.http.get<ICompanyModel[]>(`${this.baseUrl + this.companyUrl}`)
  }

  // the api doesn't appear to have a get company
  getCompany(id: number): Observable<ICompanyModel> {
    return this.http.get<ICompanyModel>(`${this.baseUrl + this.companyUrl}/${id}`).pipe(catchError(this.handleError));
  }

  postCompany(company: ICompanyModel): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.baseUrl + this.companyUrl}/`,  JSON.stringify(company), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  putCompany(company: ICompanyModel): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.baseUrl + this.companyUrl}/${company.CompanyId}`, JSON.stringify(company), {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  deleteCompany(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl + this.companyUrl}/${id}`, {
      headers: httpHeaders,
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }
 
}




