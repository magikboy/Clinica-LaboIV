import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ITurno } from '../interfaces/turno.interface';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  firestore = inject(Firestore);

  addTurno(turno: any) {
    let col = collection(this.firestore, 'turnos');
    return addDoc(col, turno);
  }

  getAll(): Observable<ITurno[]> {
    let col = collection(this.firestore, 'turnos');
    return collectionData(col, { idField: 'id' }).pipe(
      map((turnos) => {
        return turnos.map((turno: any) => {
          const fechaTimeStamp = turno.fecha as Timestamp;
          turno.fecha = fechaTimeStamp.toDate();
          return turno as ITurno;
        });
      })
    ) as Observable<ITurno[]>;
  }

  getTurnosRoleUid(role: string, uid: string): Observable<ITurno[]> {
    let col = collection(this.firestore, 'turnos');
    let consulta = query(col, where(`${role}Uid`, '==', uid));

    consulta = query(consulta, orderBy('fecha', 'desc'));

    return collectionData(consulta, { idField: 'id' }).pipe(
      map((turnos) => {
        return turnos.map((turno: any) => {
          const fechaTimeStamp = turno.fecha as Timestamp;
          turno.fecha = fechaTimeStamp.toDate();
          return turno as ITurno;
        });
      })
    );
  }

  update(turno: ITurno, data: any) {
    let docTurno = doc(this.firestore, 'turnos', turno.id!);
    return updateDoc(docTurno, data);
  }
}
