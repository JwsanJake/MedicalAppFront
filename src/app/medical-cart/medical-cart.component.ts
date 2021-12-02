import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Patient } from '../models/Patient';
import { Visit } from '../models/Visit';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-medical-cart',
  templateUrl: './medical-cart.component.html',
  styleUrls: ['./medical-cart.component.css']
})
export class MedicalCartComponent implements OnInit {

    addForm: FormGroup;
    docFIO: FormControl;
    docSpec: FormControl;
    visitDate: FormControl;
    complaints: FormControl;
    diagnosis: FormControl;

    updateForm: FormGroup;
    _visitId: FormControl;
    _docFIO: FormControl;
    _docSpec: FormControl;
    _visitDate: FormControl;
    _complaints: FormControl;
    _diagnosis: FormControl;


    patient: Patient;
    visits: Visit[];
    visit: Visit;
    visits$: Observable<Visit[]>
    Id: number;

    //Add Modal
    @ViewChild('addTemplate') addModal : TemplateRef<any>;
    @ViewChild('updateTemplate') updateModal : TemplateRef<any>;
    modalRef : BsModalRef;

    constructor(private route: ActivatedRoute,
        private mainSvc: MainService,
        private modalService: BsModalService,
        private fb: FormBuilder,) { }


    ngOnInit(): void {
        this.Id =+this.route.snapshot.params["id"];
        
        this.mainSvc.getPatientById(this.Id).subscribe(res => {
            this.patient = res;
            
        })

        this.mainSvc.getMedicalCardById(this.Id).subscribe(res => {
            this.visits = res;
        })


        this.docFIO = new FormControl('', [Validators.required]);
        this.docSpec = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
        this.visitDate = new FormControl('', [Validators.required]);
        this.complaints = new FormControl('', [Validators.required]);
        this.diagnosis = new FormControl('', [Validators.required]);

        this.addForm = this.fb.group({

            'docFIO' : this.docFIO,
            'docSpec' : this.docSpec,
            'visitDate' : this.visitDate.value,
            'complaints' : this.complaints,
            'diagnosis' : this.diagnosis
            });


        this._docFIO = new FormControl('', [Validators.required]);
        this._docSpec = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
        this._visitDate = new FormControl('', [Validators.required]);
        this._complaints = new FormControl('', [Validators.required]);
        this._diagnosis = new FormControl('', [Validators.required]);

        this.updateForm = this.fb.group({

            'visitId' : this._visitId,
            'docFIO' : this._docFIO,
            'docSpec' : this._docSpec,
            'visitDate' : this._visitDate,
            'complaints' : this._complaints,
            'diagnosis' : this._diagnosis
            });

    }

    onAddVisit() {
        this.modalRef = this.modalService.show(this.addModal);
    }


    onSubmit() {

        let newVisit = this.addForm.value;

        console.log(newVisit);
        
        console.log(this.Id);
        
        this.mainSvc.addVisit(newVisit).subscribe(
            result =>
            {
                this.mainSvc.clearCache();
                this.visits$ = this.mainSvc.getMedicalCardById(this.Id);
                this.visits$.subscribe(newList => {
                    this.visits = newList;
                    this.modalRef.hide();
                    this.addForm.reset();

                });

                console.log("Добавлен новый прием у врача!");
            },
            error => console.log("Не удалось добавить прием у врача")
        )
    }


    onUpdateVisit(updateVisit: Visit) {

        this._visitId.setValue(updateVisit.visitId);
        this._docFIO.setValue(updateVisit.docfio);
        this._docSpec.setValue(updateVisit.docspec);
        this._visitDate.setValue(updateVisit.visitDate);
        this._complaints.setValue(updateVisit.complaints);
        this._diagnosis.setValue(updateVisit.diagnosis);

        this.updateForm.setValue({
            'visitId' : this._visitId.value,
            'docFIO' : this._docFIO.value,
            'docSpec' :  this._docSpec.value,
            'visitDate' : this._visitDate.value,
            'complaints' : this._complaints.value,
            'diagnosis' : this._diagnosis.value
         });

        this.modalRef = this.modalService.show(this.updateModal);
    }

    updateVisit() {
        let updateVisit = this.updateForm.value;
        this.mainSvc.updateVisit(updateVisit.visitId, updateVisit).subscribe(
        result => 
        {
            console.log('Обновлены данные по приему');
            this.mainSvc.clearCache();
            this.visits$ = this.mainSvc.getMedicalCardById(updateVisit.visitId);
            this.visits$.subscribe(updatedlist => 
             { 
                this.visits = updatedlist; 
 
                  this.modalRef.hide();
            });
        },
            error => console.log('Не удалось обновить данные')
        )
    }


    deleteVisit(visit: Visit) {

        this.mainSvc.deleteVisit(visit.visitId).subscribe(result =>{

            this.mainSvc.clearCache();
            this.visits$ = this.mainSvc.getMedicalCardById(visit.visitId);
            this.visits$.subscribe(newList => 
                {
                    this.visits = newList
                })

                console.log('Удален прием к врачу!!');
                
        })
    }

}
