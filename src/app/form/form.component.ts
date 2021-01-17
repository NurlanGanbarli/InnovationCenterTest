import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MartyrService } from '../_services/api/martyr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { File } from '../_models/File';
import { Apartment, ApartmentPhoto, Martyr } from '../_models/Martyr';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private martyrService: MartyrService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  @Output() dateChange:EventEmitter< MatDatepickerInputEvent< any>>;
  regions: any;
  martyrForm: FormGroup
  martyrData: Martyr;
  // apartmenData: Apartment[] = [{

  // }];
  martyrBirthdate: string;
  dateOfMartyrdomOrVeteran: string
  // apartmentPhotos: ApartmentPhoto[];


  // get regions
  getRegions() {
    this.martyrService.getRegions().subscribe(
      (response: any) => {
        this.regions = response.regions;
      },
      error => {
        console.log(error);
      }
    )
  }

  // get form controls
  get controls() {
    return this.martyrForm.controls;
  }

  // get children as form array
  get children(): FormArray {
    return this.martyrForm.get("children") as FormArray
  }

  // get rewards as form array
  get rewards(): FormArray {
    return this.martyrForm.get("rewards") as FormArray
  }

  // get rewards as form array
  get apartments(): FormArray {
    return this.martyrForm.get("apartments") as FormArray
  }

  // empty child
  newChild(): FormGroup {
    return this.fb.group({
      name: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]),
      surname: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]),
      fin: this.fb.control('', [ Validators.minLength(7), Validators.maxLength(7) ]),
      birthdate: this.fb.control('', [ Validators.required ]),
      gender: this.fb.control(0,),
      identityPhotoId: this.fb.control(null),
    })
  }

  // add new children form to form array
  addChild() {
    this.children.push(this.newChild());
  }

  // remove child from form array
  removeChild(i:number) {
    this.children.removeAt(i);
  }

  // empty reward
  newReward(): FormGroup {
    return this.fb.group({
      name: this.fb.control('', [ Validators.required, Validators.minLength(1), Validators.maxLength(1000) ]),
      date: this.fb.control('', [ Validators.required ]),
    })
  }

  // add new reward form to form array
  addReward() {
    this.rewards.push(this.newReward());
  }

  // remove reward from form array
  removeReward(i:number) {
    this.rewards.removeAt(i);
  }

  // empty apartment
  newApartment(): FormGroup {
    return this.fb.group({
      peopleCount: this.fb.control('', [ Validators.required, Validators.min(0) ]),
      totalArea: this.fb.control('', [ Validators.required, Validators.min(0) ]),
      roomCount: this.fb.control('', [ Validators.required, Validators.min(0) ]),
      hasDocument: this.fb.control('', [ Validators.required ]),
      photos: this.fb.control([{photoId: ''}])
    })
  }

  // add new apartment form to form array
  addApartment() {
    this.apartments.push(this.newApartment());
  }

  // remove apartment from form array
  removeApartment(i:number) {
    this.apartments.removeAt(i);
  }


  // file upload
  documentUpload(event, type: number, index?: number) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append(`file`, file);

    this.martyrService.uploadFile(formData).subscribe(
      (response: File) => {
        switch (type) {
          case 1:
            this.controls.identityPhotoId.setValue(response.id);
            break;
          case 2:
            this.children.controls[index]['controls'].identityPhotoId.setValue(response.id);
            break;
          case 3:
            if (this.apartments.value[index].photos[0].photoId !== '') {
              this.apartments.value[index].photos.push({photoId: response.id});
            } else {
              this.apartments.value[index].photos[0].photoId = response.id;
            }
            break;
          default:
            break;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // remove photo
  removePhoto(type: number, index?: number, photoIndex?: number) {
    switch (type) {
      case 1:
        this.controls.identityPhotoId.setValue(null);
        break;
      case 2:
        this.children.value[index].identityPhotoId = null;
        break;
      case 3:
        this.apartments.value[index].photos.splice(photoIndex, 1);
        break;
      default:
        break;
    }
  }

  // change date format
  changeDateFormat(date: any, type: number, index?: number) {
    const momentDate = moment(date).format();

    switch (type) {
      case 1:
        this.martyrBirthdate = momentDate;
        break;
      case 2:
        this.children.controls[index]['controls'].birthdate.setValue(momentDate);
        break;
      case 3:
        this.rewards.controls[index]['controls'].date.setValue(momentDate);
        break;
      case 4:
        this.dateOfMartyrdomOrVeteran = momentDate;
        break;
      default:
        break;
    }

  }

  // submit form
  submitForm() {
    this.martyrData = {
      contactInfo: this.controls.contactInfo.value,
      name: this.controls.name.value,
      surname: this.controls.surname.value,
      fathername: this.controls.fathername.value,
      birthdate: this.martyrBirthdate,
      fin: this.controls.fin.value,
      familyAddress: this.controls.familyAddress.value,
      dateOfMartyrdomOrVeteran: this.dateOfMartyrdomOrVeteran,
      regionId: this.controls.regionId.value,
      identityPhotoId: this.controls.identityPhotoId.value,
      children: this.children.value,
      rewards: this.rewards.value,
      apartments: this.apartments.value,
    }

    this.martyrService.setMartyr(this.martyrData).subscribe(
      (response: any) => {
        if (response.id) {
          this.router.navigateByUrl('/success');
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnInit(): void {
    this.martyrForm = this.fb.group({
      name: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]),
      surname: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]),
      fathername: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]),
      birthdate: this.fb.control('', [ Validators.required ]),
      contactInfo: this.fb.control('', [ Validators.required, Validators.minLength(1), Validators.maxLength(250) ]),
      fin: this.fb.control('', [ Validators.minLength(7), Validators.maxLength(7) ]),
      familyAddress: this.fb.control('', [ Validators.required, Validators.minLength(2), Validators.maxLength(250) ]),
      dateOfMartyrdomOrVeteran: this.fb.control('', [ Validators.required ]),
      regionId: this.fb.control('0', [ Validators.min(0) ]),
      identityPhotoId: this.fb.control(null),
      children: this.fb.array([]),
      rewards:  this.fb.array([]),
      apartments: this.fb.array([]),
    })

    this.getRegions();
    this.addChild();
    this.addReward();
    this.addApartment();

  }

}
