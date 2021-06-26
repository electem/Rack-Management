import { FormService } from './../../services/app.form.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-Template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css']
})
export class TemplateDetailsComponent implements OnInit {
  currentTemplate: Template = {
    name: '',
    subscriberId: '',
  };
  message = '';

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    let id = '';
    id = this.route.snapshot.params['id'];
    this.getTemplate(this.route.snapshot.params.id);
  }

  getTemplate(id: string): void {
    this.formService.get(id)
      .subscribe(
        data => {
          this.currentTemplate = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status: boolean): void {
    const data = {
      name: this.currentTemplate.name,
      subscriberId: this.currentTemplate.subscriberId,
    };

    this.message = '';

    this.formService.update(this.currentTemplate.id, data)
      .subscribe(
        response => {

          console.log(response);
          this.message = response.message ? response.message : 'This Template was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  updateTemplate(): void {
    this.message = '';

    this.formService.update(this.currentTemplate.id, this.currentTemplate)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'This Template was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  // deleteTemplate(): void {
  //   this.formService.delete(this.currentTemplate.id)
  //     .subscribe(
  //       response => {
  //         console.log(response);
  //         this.router.navigate(['/template']);
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // }
}
