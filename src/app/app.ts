import {Component, OnInit } from 'angular2/core';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS,RouteConfig, Router, Route, AuxRoute, RouteParams} from 'angular2/router';
import * as _ from 'lodash';
import {LoginPayload}           from './login_payload';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {FORM_PROVIDERS} from 'angular2/common';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material/all";
import {RouterActive} from './directives/router-active';
import {About} from './about.async';
import {DetailsShow} from './details_show.cmp';
import {ArtistForm} from './forms/artist_form.cmp';
import {GenreForm} from './forms/genre_form.cmp';
import {AlbumForm} from './forms/album_form.cmp';
import {TrackForm} from './forms/track_form.cmp';
import {UserForm} from './forms/user_form.cmp';
import {LoginForm} from './forms/login_form.cmp';
import {MMList}    from './list.cmp';
import {ApiService}       from './services/api.service';
import {SpinnerComponent} from './utils/spinner.cmp';



/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [...FORM_PROVIDERS, MATERIAL_PROVIDERS, ApiService],
  directives: [
  ROUTER_DIRECTIVES,
   SpinnerComponent,
   RouterActive,
   DetailsShow,
   ArtistForm,
   GenreForm,
   AlbumForm,
   TrackForm,
   UserForm,
   MMList
   ],
  pipes: [],
  styles: [require('./app.scss')],
  template: require('!jade!./app.jade')()
})
@RouteConfig([
  { path: '/', component: MMList, name: 'MMList' },
  // Async load a component using Webpack's require with es6-promise-loader
  { path: '/about', loader: () => require('./about')('About'), name: 'About' },
  { path: '/login', component: LoginForm, name: 'LoginForm' },
  { path: '/**', redirectTo: ['MMList'] }
])
export class App implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  public spinner_active: boolean = true;
  constructor(private _router: Router,
              private _apiService: ApiService
              ) {}
  ngOnInit() {
    var token = localStorage.getItem('id_token');
    // console.log(
    //   this.jwtHelper.decodeToken(token),
    //   this.jwtHelper.getTokenExpirationDate(token),
    //   this.jwtHelper.isTokenExpired(token)
    // );
    //console.log('!tokenNotExpired()',tokenNotExpired());
   if (!tokenNotExpired()) {
     this._router.navigate(['/LoginForm']);
   } else {
    this._router.navigate(['/MMList']);
   }
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 * or via chat on Gitter at https://gitter.im/AngularClass/angular2-webpack-starter
 */
