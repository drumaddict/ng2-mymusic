import {View, Component, OnInit, AfterViewInit,
  AfterViewChecked} from 'angular2/core';
import {MdPatternValidator, MdMinValueValidator, MdNumberRequiredValidator, MdMaxValueValidator, MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, Validators, FormBuilder, Control, ControlGroup, ControlArray, FORM_BINDINGS, AbstractControl} from 'angular2/common';
import {CrudService}   from '../services/crud.service';
//import {Artist}              from './user';
import {SpinnerComponent} from '../utils/spinner.cmp';
import {ApiService}       from '../services/api.service';
import * as _ from 'lodash';
import * as pluralize from 'pluralize'



const validate = c => {
  if (!c.value || c.value == 'undefined') {
    console.log('required');
    //return { required: true };
    return null;
  };
  return null;
}

enum FormAction {
  Create,
  Update
}


enum Role {
  User,
  Admin,
  SuperAdmin
}

@Component({
  selector: 'user-form',
  template: require('!jade!./user_form.jade')(),
  styles: [require('./form.scss')],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, SpinnerComponent],
  viewBindings: [FORM_BINDINGS],
  providers: [ApiService]
})
export class UserForm implements OnInit {



  user: any;
  show: Boolean = false;
  userForm: ControlGroup;
  public spinner_active: boolean = false;

  form_action: number = FormAction.Create;
  new_user: any = {
    entities: [
      { class: ['album'] },
    ],
    properties: {

      name: '',
      email: '',
      role: 0
    },
    class: ['user']
  };


  constructor(private fb: FormBuilder, private _crudService: CrudService, private _apiService: ApiService) {
    this._crudService.edit$.subscribe(object => this.onEdit(object));
    this._crudService.create$.subscribe(object => this.onCreate(object));


    this.userForm = fb.group({
      //'user':fb.group({
      name: [undefined, Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      email: [undefined, Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      password: [undefined, Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],

      password_confirmation: [undefined, Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],

      role: [undefined, Validators.compose([
        Validators.required,
        MdNumberRequiredValidator
      ])],

      // genre_id: [undefined, validate]
      // /users_attributes: new ControlArray(this.ctrlAlbums)
    })

    console.log('this.FB', this.fb);
    console.log('userForm.control');

  }

  ngOnInit() {
    //this.titleCtrl = this.userForm.controls['user'].controls['title'];

    this.user = this.new_user;

    this._crudService.show_details$.subscribe(object => this.onObjectShow(object));
    console.log('Track Form started')
  }

  ngAfterViewInit() {


  }
  onEdit(object: any) {
    console.log('onEFIT USER', object);
    if (object.item.class[0] == 'user') {
      this.form_action = FormAction.Update
      this.show = true;
      this.user = object.item as any;

    }
  }

  onCreate(object: any) {
    // this.user = null;
    // this.user = <Artist>object;
    console.log('object in USER FORM', object);
    if (object.list_type == 'user') {
      console.log('USER CREATED RUN')
      this.form_action = FormAction.Create
      this.show = true;
      this.user = {
        entities: [
          { class: ['album'] },
        ],
        properties: {

          name: '',
          email: '',
          role: 0
        },
        class: ['user']
      };

    }
  }




  onObjectShow(object: any) {

    console.log('user onObjectShow in form', this.user)
    console.log('this.userForm.value ON SELECT', this.userForm.value)
    console.log('FORMBUILDER userForm', this.userForm)

  }



  handleForm(user: any) {

    console.log('user in UYPDATE', user)
    console.log('this.userForm.value', this.userForm.value)
    let user_payload = {
      user: this.userForm.value
    }

   // user_payload.user.role = parseInt(user_payload.user.role);




    console.log('user_paylod in user_form   ', user_payload);

    var uri: string;
    var action: string;
    if (this.form_action == FormAction.Create) {
      uri = 'users'
      action = 'post'

    } else {
      uri = `users/${this.user.properties.id}`
      action = 'put'
    }
    //var uri = `users/${this.user.properties.id}`;
    this.spinner_active = true;
    this._apiService.req(action, uri, {}, user_payload)
      .map(response => <any>response.json())
      .subscribe(
      response => this.updateSuccess(response),
      error => this.updateError = <any>error
      );
  }

  updateSuccess(response: any) {
    //this.users = response.entities;

    this.spinner_active = false;
    if (this.form_action == FormAction.Create) {
      this._crudService.create_success(response)

      console.log('CREAT HANDLED');
    } else {
      this._crudService.update(response)
      console.log('UPDATE HANDLED');

    }
    this.show = false;
    console.log('this.show', this.show)
    //this.total_pages = response.total_pages;
    //this.total_count = response.total_count;
    //this.page_size = response.page_size;
  };

  updateError(error: any) {
    console.log('ERROR UPDATE', error);
  };


}