import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, getDocs, query, where } from '@angular/fire/firestore';
import { IUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  AddData(colection: string, data : any) {
    let col = collection(this.firestore, colection);
    addDoc(col, data);
  }
}
