import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { IUser } from '../interfaces/user.interface';
import { IHorarios, defaultHorarios } from '../interfaces/horarios.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private firestore = inject(Firestore);
  authService = inject(AuthService);
  
  async ObtenerHorarios(key: string, value: any) : Promise<IHorarios> {
    try
    {
      let col = collection(this.firestore, 'horarios');
      const consulta = query(col, where(key, "==", value));
      const consultaEjecuto = await getDocs(consulta);

      if(consultaEjecuto.size > 0) {
        let horarios = consultaEjecuto.docs[0].data() as IHorarios;
        horarios.id = consultaEjecuto.docs[0].id;
        return horarios;
      }
      return defaultHorarios;
    }
    catch(error:any)
    {
      return {
        id: '',
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: []
      };
    }
  }

  update(horarios: IHorarios) {
    if(horarios.id)
    {
      let docPelicula = doc(this.firestore, 'horarios', horarios.id);
      return updateDoc(docPelicula, horarios);
    }
    else {
      horarios.uid = this.authService.currentUserSignal()?.uid;
      return this.add(horarios);
    }
  }

  add(turno: IHorarios) {
    let col = collection(this.firestore, 'horarios');
    return addDoc(col, turno);
  }
}
