import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  constructor(private toastr:ToastrService ) { }

  ngOnInit() {
    this.toastr.error('Everything is broken', 'Epic Failure', {
      closeButton: true,
      timeOut: 5000, // milliseconds
      enableHtml: true, // allows html in the message
      tapToDismiss: true, // click toastr to close
    });

    var listItems = [
      {'message':'Material Design 8.1.4','description':'The Material UI interface components and controls'},
      {'message':'NGX Spinner 8.0.3','description':'Spinner control for ajax operations'},
      {'message':'NGX Toastr 10.2.0','description':'Displaying toaster messages'},
      {'message':'Rxjs 6.5.3','description':'Library for using observables'}
    ]

    // Rjxs observable example
   // this below is considered a "Cold" observable because 
    // it is activated when a subscription is created
    // everything inside the Observable.create() function
    // is called a "producer" because it produces or emits the values
    // 
    // A "warm" observable is when values are emitted outside
    // the producer

    var observable = Observable.create((observer:any) => {
      try {
        // iterate through the items and emit
        listItems.forEach(element => {
          observer.next(element.message + " - " + element.description);
        });
        observer.complete();
      }
      catch(err) {
        observer.error(err);
      }
    });
    
    // subscribe to the observable
    // observable.subscribe(
    //   (x:any) => addItem(x),
    //   (error:any) => addItem(error),
    //   () => console.log("done")
    // );

    observable.subscribe({
      next(x:any) { addItem(x); },
      error(err:any) { addItem(err); },
      complete() { console.log('done'); }
    });
  }
}

// function for sending observable data to the view
function addItem(val:any) {
  var node = document.createElement("li");
  var textNode = document.createTextNode(val);
  node.appendChild(textNode);
  document.getElementById("output").appendChild(node);
};
