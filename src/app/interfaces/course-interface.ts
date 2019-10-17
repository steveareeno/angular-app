export interface ICourseModel {
  CourseId        : number;
  AuthorId        : number;
  Title           : String;
  CourseLength    : String;
  Category        : String;
  CourseDate      : String;
  // extended props
  AuthorName      : String;
  IsNew           : boolean;
  IsEdit          : boolean;
}

