import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/Patient';
import { flatMap, first} from 'rxjs/operators';
import { Visit } from '../models/Visit';

@Injectable({
  providedIn: 'root'
})
export class MainService {


    constructor(private http: HttpClient) {}

    private baseUrl: string = "https://localhost:44366/main";


    public patient : Patient;
    private patients$: Observable<Patient[]>;
    private visits$: Observable<Visit[]>;

    getAllPatients() {

        if (!this.patients$) 
        {
            this.patients$ = this.http.get<Patient[]>(this.baseUrl + '/getAllPatients');
        }

        return this.patients$;
    }

    getPatientById(id: number) {
        return this.getAllPatients().pipe(flatMap(result => result), first(patient => patient.patientId == id));

    }

    getMedicalCardById(id: number) {
        
        this.visits$ = this.http.get<Visit[]>(this.baseUrl + '/getMedicalCardById/' + id);

        return this.visits$;
    }

    addPatient(newPatient: Patient): Observable<Patient> {

        return this.http.post<Patient>(this.baseUrl + '/addPatient', newPatient);
    }

    updatePatient(id: number, updatePatientInfo: Patient) {
        return this.http.put<Patient>(this.baseUrl + "/updatePatientInfo"+ id, updatePatientInfo);
    }

    deletePatient(id: number) {

        return this.http.delete<Patient>(this.baseUrl + '/deletePatient/' + id)
    }

    addVisit(newVisit: Visit): Observable<Visit> {

        return this.http.post<Visit>(this.baseUrl + '/addPatientVisit', newVisit );
    }

    updateVisit(id:number, updateVisitInfo: Visit ) {

        return this.http.put<Visit>(this.baseUrl + '/updateVisitInfo' + id, updateVisitInfo);
    }

    deleteVisit(id: number) {

        return this.http.delete<Visit>(this.baseUrl + '/deleteVisit' + id);
    }

    clearCache() 
    {
        this.patients$ = null;
    }


}
