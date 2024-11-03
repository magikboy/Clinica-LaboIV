import { Injectable, inject, signal } from '@angular/core';

import { Auth, User, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';

import { Observable, from } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestoreService = inject(FirestoreService);
  userService = inject(UserService);

  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<IUser | null | undefined>(undefined);
  userFire : User | null = null;

  constructor () {
    this.user$.subscribe(
      (user) => {
        this.userFire = user;
        if (user)
        {
          this.userService.obtenerInfoUsuario(user.uid)
          .then((finalUser) => {
                this.currentUserSignal.set(finalUser);
          });
        }
        else
        {
          this.currentUserSignal.set(null);
        }
      }
    );
  }

  singIn(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => { });
    return from(promise);
  }

  singUp(data : any): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      data.email,
      data.password,
    ).then(
      res => {
        const dataAux = {... data};
        delete dataAux.password;
        delete dataAux.rePassword;
        dataAux.uid = res.user.uid;
        this.firestoreService.AddData('users', dataAux);
      }
    );
    return from(promise);
  }

  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  async isLoggedIn() : Promise<boolean> {
    const timeLimit = 10000;
    const interval = 100;
    let time = 0;
    let user = this.currentUserSignal();

    while (typeof user === typeof undefined && time < timeLimit) {
      await new Promise(resolve => setTimeout(resolve, interval));
      user = this.currentUserSignal();
      time += interval;
    }
  
    if(user)
      return true;

    return false;
  }

  sendEmail() {
    if(this.userFire)
    {
      return sendEmailVerification(this.userFire);
    }
    return null;
  }

  reload() {
    if(this.userFire)
      return this.userFire.reload();
    return null;
  }
}
