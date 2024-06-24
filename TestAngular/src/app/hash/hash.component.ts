import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

interface HashResponse {
  hash: string;
}

@Component({
  selector: 'pm-hash',
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.css']
})
export class HashComponent implements OnInit, OnDestroy {
  attribution = '<a href="https://www.freepik.com/free-vector/graphic-design-geometric-wallpaper_7088577.htm#query=graphic%20design&position=48&from_view=keyword">Image by pikisuperstar</a> on Freepik';
  firstName = 'archit';
  hash = '';
  pageTitle = 'Hash Generator';

  private unsubscribe$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  generateHash() {
    if (this.firstName === '') {
      console.error('Please enter a name');
      return;
    }

    this.http.get<HashResponse>(`http://localhost:5000/api/Hash/${this.firstName.toLowerCase()}`)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(err => {
          console.error('HTTP Error:', err);
          return throwError(err);
        })
      )
      .subscribe(res => {
        if (res.hash === '') {
          console.error('Empty hash received');
          return;
        }
        // Check for hyphen in the hash
        if (res.hash.includes('-')) {
          console.error('Not a valid hash, The hash should not contain a hyphen. Maybe the response from server should be updated');
          return;
        }
        this.hash = res.hash;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
