import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { IEspecialista, IUser } from '../interfaces/user.interface';
import { ITurno } from '../interfaces/turno.interface';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  async obtenerUsuarioEmail(email: string): Promise<IUser | null> {
    return this.ObtenerUsuario('email', email);
  }

  async obtenerInfoUsuario(uid: string): Promise<IUser | null> {
    return this.ObtenerUsuario('uid', uid);
  }

  async obtenerUsuarioDni(dni: string): Promise<IUser | null> {
    return this.ObtenerUsuario('dni', dni);
  }

  async ObtenerUsuario(key: string, value: any): Promise<IUser | null> {
    try {
      const col = collection(this.firestore, 'users');
      const consulta = query(col, where(key, '==', value));
      const consultaEjecuto = await getDocs(consulta);

      if (consultaEjecuto.size > 0) {
        return consultaEjecuto.docs[0].data() as IUser;
      }
      return null;
    } catch (error: any) {
      return null;
    }
  }

  async ObtenerUsuarios(key: string, value: any): Promise<IUser[]> {
    const users: IUser[] = [];
    try {
      const col = collection(this.firestore, 'users');
      const consulta = query(col, where(key, '==', value));
      const consultaEjecuto = await getDocs(consulta);

      for (const user of consultaEjecuto.docs) {
        users.push(user.data() as IUser);
      }

      return users;
    } catch (error: any) {
      return [];
    }
  }

  async updateEstaHabilitado(
    especialista: IEspecialista,
    estaHabilitado: boolean
  ): Promise<boolean> {
    try {
      const col = collection(this.firestore, 'users');
      const consulta = query(col, where('uid', '==', especialista.uid));
      const consultaEjecuto = await getDocs(consulta);

      if (consultaEjecuto.size > 0) {
        await updateDoc(consultaEjecuto.docs[0].ref, {
          estaHabilitado: estaHabilitado,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      return false;
    }
  }

  async getUsersByRole(role: string): Promise<IUser[]> {
    try {
      const users: IUser[] = [];
      const col = collection(this.firestore, 'users');
      const consulta = query(col, where('role', '==', role));
      const consultaEjecuto = await getDocs(consulta);

      for (const doc of consultaEjecuto.docs) {
        users.push(doc.data() as IUser);
      }

      return users;
    } catch (err) {
      return [];
    }
  }

  async getUserByUid(uid: string): Promise<IUser | null> {
    return this.ObtenerUsuario('uid', uid);
  }

  async getUserAppointments(user: IUser): Promise<ITurno[]> {
    const col = collection(this.firestore, 'turnos');
    let q;

    if (user.role === 'especialista') {
      q = query(col, where('especialistaUid', '==', user.uid));
    } else if (user.role === 'paciente') {
      q = query(col, where('pacienteUid', '==', user.uid));
    } else {
      // Manejar otros roles si es necesario
      return [];
    }

    const querySnapshot = await getDocs(q);
    const appointments: ITurno[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as ITurno;

      // Convertir 'fecha' de Timestamp a Date si es necesario
      if (data.fecha instanceof Timestamp) {
        data.fecha = data.fecha.toDate();
      }

      appointments.push(data);
    });

    return appointments;
  }
}
