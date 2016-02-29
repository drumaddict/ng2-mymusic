import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
import {Artist}           from './artist';
import {Observable}     from 'rxjs/Observable';
import { ARTISTS } from './mock-artists';

@Injectable()
export class ArtistService {
  constructor(private http: Http) { }

  /*
  private _heroesUrl = 'app/heroes.json'; // URL to JSON file
  */

  private _artistsUrl = 'http://api.app.me:3000/v1/artists';  // URL to web api

  getArtists() {
    let headers = new Headers({
      'Content-Type': 'application/siren',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTY4MzY0NTIsImF1ZCI6Ik15IE11c2ljIFVzZXJzIiwiaWQiOjEsImVtYWlsIjoia2FiYXNha2FsaXNAZ21haWwuY29tIn0.acBYbFDIHKqUriN5mJ1esDB-8DyAcnRvHl8nGVAPSBk'
    });

    let options = new RequestOptions({ headers: headers });


    return this.http.get(this._artistsUrl, options)
      .map(res => <Artist[]>res.json().entities)
      .do(data => console.log(data)) // eyeball results in the console
      .catch(this.handleError);
  }

  addArtist(title: string): Observable<Artist> {

    let body = JSON.stringify({ title });
    let headers = new Headers({
      'Content-Type': 'application/siren',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTY2Njc1NTcsImF1ZCI6Ik15IE11c2ljIFVzZXJzIiwiaWQiOjEsImVtYWlsIjoia2FiYXNha2FsaXNAZ21haWwuY29tIn0.uLE4XkS_wdbky-JflBXtvd6UZLhntoBngcxr8TZ_DSU'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._artistsUrl, body, options)
      .map(res => <Artist>res.json().data)
      .catch(this.handleError)
  }

  private handleError(error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/