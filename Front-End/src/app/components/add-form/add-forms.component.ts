import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formdata } from 'src/app/models/form-builder.model';
import { FormService } from './../../services/app.form.service';
import { Client } from '../../client';
import swal from 'sweetalert2';
@Component({
  selector: 'app-add-forms',
  templateUrl: './add-forms.component.html',
  styleUrls: ['./add-forms.component.css']
})
export class AddFormComponent implements OnInit {
  model: Formdata = {
    name: '',
    description: '',
    attributes: [],
  };
  itemTempId = '';
  success = false;
  UserObj: any = {};
  clientFk: '';
  constructor(private route: ActivatedRoute,
    private router: Router, private formService: FormService) { }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.itemTempId = this.route.snapshot.params.id;
    this.getFormData(this.route.snapshot.params.id);
    this.clientFk = this.UserObj.clientFk;
  }

  toggleValue(item) {
    item.selected = !item.selected;
  }

  getFormData(id: string): void {
    let datas ;
      this.formService.get(id)
          .subscribe(
            data => {
              datas = data;
              datas.name = '';
              if (Array.isArray(datas.attributes)) {
                this.model = datas;
              } else {
                datas.attributes = JSON.parse(datas.attributes);
                this.model = datas;
              }
          },
              error => {
                  console.log(error);
              });
  }

  cancel() {
    this.router.navigate(['/menu/' + this.route.snapshot.params.name + '/' + this.route.snapshot.params.id]);
    this.formService.getAll(this.clientFk);
  }

  submit() {
    let valid = true;
    const validationArray = JSON.parse(JSON.stringify(this.model.attributes));
    validationArray.reverse().forEach(field => {
      console.log(field.label + '=>' + field.required + '=>' + field.value);
      if (field.required && !field.value && field.type != 'checkbox') {
        swal('Error', 'Please enter ' + field.label, 'error');
        valid = false;
        return false;
      }
      if (field.required && field.regex) {
        const regex = new RegExp(field.regex);
        if (regex.test(field.value) == false) {
          swal('Error', field.errorText, 'error');
          valid = false;
          return false;
        }
      }
      if (field.required && field.type == 'checkbox') {
        if (field.values.filter(r => r.selected).length == 0) {
          swal('Error', 'Please enterrr ' + field.label, 'error');
          valid = false;
          return false;
        }

      }
    });
    if (!valid) {
      return false;
    }
    console.log('Save', this.model);
    const input = new FormData;
    input.append('formId', this.model.id);
    input.append('attributes', JSON.stringify(this.model.attributes));
    // this.us.postDataApi('/user/formFill',input).subscribe(r=>{
    //   console.log(r);
    //   swal('Success','You have contact sucessfully','success');
    //   this.success = true;
    // },error=>{
    //   swal('Error',error.message,'error');
    // });
   const data = {
      name: this.model.name,
      description: this.model.description,
      attributes: this.model.attributes,
      itemTempId: this.itemTempId,
    };

    

    this.formService.createForm(data,  this.route.snapshot.params.name)
      .subscribe(
        response => {
          console.log(response);
          this.success = true;
          this.router.navigate(['/menu/' +   this.route.snapshot.params.name + '/' +  this.route.snapshot.params.id]);
          this.formService.getAll(this.clientFk );
         // this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }
}
