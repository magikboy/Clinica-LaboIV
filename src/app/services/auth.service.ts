import { Injectable, inject, signal } from '@angular/core';

import { Auth, User, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';

import { Observable, from, map } from 'rxjs';
import { IEspecialista, IUser } from '../interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { addDoc, collection, collectionData, Firestore, Timestamp } from '@angular/fire/firestore';
import { Iingreso } from '../interfaces/ingreso.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestoreService = inject(FirestoreService);
  userService = inject(UserService);
  firestore = inject(Firestore);

  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<IUser | null | undefined>(undefined);
  userFire: User | null = null;

  constructor() {
    this.user$.subscribe(
      (user) => {
        this.userFire = user;
        if (user) {
          if (user.emailVerified) {
            this.userService.obtenerInfoUsuario(user.uid)
              .then((finalUser) => {
                if (finalUser?.role == 'especialista') {
                  const castedUser = finalUser as IEspecialista;
                  if (castedUser.estaHabilitado) {
                    this.currentUserSignal.set(finalUser);
                    if (finalUser)
                      this.RegisterLogin(finalUser);
                  }
                  else {
                    this.currentUserSignal.set(null);
                  }
                }
                else {
                  this.currentUserSignal.set(finalUser);
                  if (finalUser)
                    this.RegisterLogin(finalUser);
                }
              });
          }
          else {
            this.currentUserSignal.set(null);
          }
        }
        else {
          this.currentUserSignal.set(null);
        }
      }
    );
  }

  RegisterLogin(user: IUser) {
    try {
      this.firestoreService.AddData('logins',
        {
          uid: user.uid,
          email: user.email,
          dni: user.dni,
          fecha: new Date(),
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  singIn(email: string, password: string): Observable<void> {
    // return new Observable((subscribe) => {
    //   signInWithEmailAndPassword(
    //     this.firebaseAuth,
    //     email,
    //     password,
    //   )
    //     .then(() => {
    //       this.isLoggedIn()
    //         .then(
    //           (isLogged) => {
    //             if (isLogged) {
    //               subscribe.next();
    //             }
    //             else {
    //               const error: any = {};
    //               if (this.userFire?.emailVerified) {
    //                 this.sendEmail();
    //                 error.code = 'auth/emailNotVerified';
    //               }
    //               else {
    //                 error.code = 'auth/noHabilitado';
    //               }
    //               subscribe.error(error);
    //             }
    //           }
    //         );
    //     })
    //     .catch ((err) => {
    //       subscribe.error(err);
    //     }
    //     );
    // });

    return new Observable((subscribe) => {
      signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password,
      )
        .then(() => {
          this.isLoggedIn()
            .then((isLogged) => {
              if (isLogged) {
                subscribe.next();
              } else {
                const error : any = {};
                if (!this.userFire?.emailVerified) {
                  this.sendEmail();
                  error.code = 'auth/emailNotVerified';
                } else {
                  error.code = 'auth/noHabilitado';
                }
                subscribe.error(error);
              }
            });
        })
        .catch((err) => {
          subscribe.error(err);
        });
    });
  }

  singUp(data: any): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      data.email,
      data.password,
    ).then(
      res => {
        const dataAux = { ...data };
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

  async isLoggedIn(): Promise<boolean> {
    const timeLimit = 10000;
    const interval = 100;
    let time = 0;
    let user = this.currentUserSignal();

    while (typeof user === typeof undefined && time < timeLimit) {
      await new Promise(resolve => setTimeout(resolve, interval));
      user = this.currentUserSignal();
      time += interval;
    }

    if (user)
      return true;

    return false;
  }

  getIngresos(): Observable<Iingreso[]> {
    let col = collection(this.firestore, 'logins');
    return collectionData(col).pipe(
      map(
        (ingresos) => {
          return ingresos.map((ingreso: any) => {
            const fechaTimeStamp = ingreso.fecha as Timestamp;
            ingreso.fecha = fechaTimeStamp.toDate();
            return ingreso as Iingreso;
          });
        }

      )
    ) as Observable<Iingreso[]>;
  }

  sendEmail() {
    if (this.userFire) {
      return sendEmailVerification(this.userFire);
    }
    return null;
  }

  reload() {
    if (this.userFire)
      return this.userFire.reload();
    return null;
  }
}