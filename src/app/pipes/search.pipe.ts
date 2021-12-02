import { Pipe, PipeTransform } from '@angular/core';
import { Patient } from '../models/Patient';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(Patients: Patient[], searchValue: string): Patient[] {
        
        if (!Patients || !searchValue) {
            return Patients;
        }

        return Patients.filter(patient =>
            patient.iin?.toString().includes(searchValue.toString()) ||
            patient.fio?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
            );
    }

}
