import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/app.form.service';
import { Formdata } from 'src/app/models/form-builder.model';

@Component({
  selector: 'app-view-form-details',
  templateUrl: './view-form-details.component.html',
  styleUrls: ['./view-form-details.component.css']
})
export class ViewFormDetailsComponent implements OnInit {

  model: Formdata = {
    name: '',
    description: '',
    attributes: [],
  };

  constructor(private tutorialService: FormService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFormData(this.route.snapshot.params.id);
  }
  getFormData(id: string): void {
    let datas ;
      this.tutorialService.getFormData(id)
          .subscribe(
              data => {
                  datas = data;
                  console.log(datas.name);
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

}