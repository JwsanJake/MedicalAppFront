import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Patient } from '../models/Patient';
import { MainService } from '../services/main.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


    addForm: FormGroup;
    FIO: FormControl;
    IIN: FormControl;
    Address: FormControl;
    Phone: FormControl;

    updateForm: FormGroup;
    _patientId: FormControl;
    _FIO: FormControl;
    _IIN: FormControl;
    _Address: FormControl;
    _Phone: FormControl;

    patients$: Observable<Patient[]>;
    patients: Patient[];
    patient: Patient;
    searchValue: string;

    // Add Modal
    @ViewChild('addTemplate') addModal : TemplateRef<any>;
    @ViewChild('updateTemplate') updateModal : TemplateRef<any>;
    modalRef : BsModalRef;

    constructor(private mainSvc: MainService,
        private modalService: BsModalService,
        private fb: FormBuilder,
        private router: Router) { }

    ngOnInit() {

        this.patients$ = this.mainSvc.getAllPatients();

        this.patients$.subscribe(result => { 
            this.patients = result; 
        });


        this.FIO = new FormControl('', [Validators.required]);
        this.IIN = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
        this.Address = new FormControl('', [Validators.required]);
        this.Phone = new FormControl('', [Validators.required]);

        this.addForm = this.fb.group({

            'FIO' : this.FIO,
            'IIN' : this.IIN,
            'Address' : this.Address,
            'Phone' : this.Phone,
    
            });

        
        this._FIO = new FormControl('', [Validators.required]);
        this._IIN = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
        this._Address = new FormControl('', [Validators.required]);
        this._Phone = new FormControl('', [Validators.required]);

        this.updateForm = this.fb.group({
            'patientId' :  this._patientId,
            'FIO' : this._FIO,
            'IIN' : this._IIN,
            'Address' : this._Address,
            'Phone' : this._Phone
            });
    }

    onAddPatient() {
        this.modalRef = this.modalService.show(this.addModal);
    }

    onSubmit() {
        let newPatient = this.addForm.value;

        console.log(this.addForm);
        

        this.mainSvc.addPatient(newPatient).subscribe(
            result =>
            {
                this.mainSvc.clearCache();
                this.patients$ = this.mainSvc.getAllPatients();

                this.patients$.subscribe(newList => {
                    this.patients = newList;
                    this.modalRef.hide();
                    this.addForm.reset();

                });

                console.log("Добавлен новый пациент!");
                
            },
            error => console.log("Не удалось добавить пациента")
            
        )
    }


    onUpdatePatient(updatePatient: Patient) {
        this._patientId.setValue(updatePatient.patientId);
        this._FIO.setValue(updatePatient.fio);
        this._IIN.setValue(updatePatient.iin);
        this._Address.setValue(updatePatient.address);
        this._Phone.setValue(updatePatient.phone);

        this.updateForm.setValue({
            'patientId' : this._patientId.value,
            'FIO' : this._FIO.value,
            'IIN' :  this._IIN.value,
            'Address' : this._Address.value,
            'Phone' : this._Phone.value
         });

        this.modalRef = this.modalService.show(this.updateModal);
    }

    updatePatient() {
        let updatePatient = this.updateForm.value;
        this.mainSvc.updateVisit(updatePatient.patientId, updatePatient).subscribe(
        result => 
        {
            console.log('Обновлены данные по пациенту!');
            this.mainSvc.clearCache();
            this.patients$ = this.mainSvc.getAllPatients();
            this.patients$.subscribe(updatedlist => 
             { 
                this.patients = updatedlist; 
 
                  this.modalRef.hide();
            });
        },
            error => console.log('Не удалось обновить данные')
        )
    }

    deletePatient(patient: Patient) {

        this.mainSvc.deletePatient(patient.patientId).subscribe(result =>{

            this.mainSvc.clearCache();
            this.patients$ = this.mainSvc.getAllPatients();
            this.patients$.subscribe(newList => 
                {
                    this.patients = newList
                })

                console.log('Удален пашиент!!');
                
        })
    }

    selectCard(patient:Patient) {
        this.patient = patient;
        
        this.router.navigateByUrl("" +  this.patient.patientId);
    }

}
