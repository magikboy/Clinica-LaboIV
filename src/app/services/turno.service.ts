import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ITurno } from '../interfaces/turno.interface';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  firestore = inject(Firestore);
  userService = inject(UserService);

  addTurno(turno: any) {
    let col = collection(this.firestore, 'turnos');
    return addDoc(col, turno);
  }

  getAll(): Observable<ITurno[]> {
    let col = collection(this.firestore, 'turnos');
    return collectionData(col, { idField: 'id' }).pipe(
      map(
        (turnos) => {
          return turnos.map((turno: any) => {
            const fechaTimeStamp = turno.fecha as Timestamp;
            turno.fecha = fechaTimeStamp.toDate();
            return turno as ITurno;
          });
        }

      )
    ) as Observable<ITurno[]>;
  }

  getTurnosRoleUid(role: string, uid: string): Observable<ITurno[]> {
    let col = collection(this.firestore, 'turnos');
    const consulta = query(col, where(`${role}Uid`, "==", uid));
    const consultaEjecuto = collectionData(consulta, { idField: 'id' }) as Observable<ITurno[]>;

    return consultaEjecuto.pipe(
      map(
        (turnos) => {
          return turnos.map((turno: any) => {
            const fechaTimeStamp = turno.fecha as Timestamp;
            turno.fecha = fechaTimeStamp.toDate();
            return turno as ITurno;
          });
        }

      )
    );
  }

  update(turno: ITurno, data : any) {
    let docPelicula = doc(this.firestore, 'turnos', turno.id!);
    return updateDoc(docPelicula, data);
  }
}
