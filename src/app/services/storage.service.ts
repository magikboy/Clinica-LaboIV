import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = inject(Storage);
  
  uploadFile(file : File) : Observable<string> {
    const downloadUrl = new Subject<string>();

    const date = new Date();
    const filePath = `files/${date.toTimeString()}_${file.name}`
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);
    uploadFile.on('state_changed', 
      (snapshot) => {},
      (error) => {
        downloadUrl.error("Error al subir el archivo");
      },
      async () => {
        const url = await getDownloadURL(fileRef);
        console.log(url)
        downloadUrl.next(url);
      }
    );

    return downloadUrl.asObservable();
  }

  uploadMultiple(multipleFileObject : any) {
    const multipleDownloadUrl = new Subject<any>();
    const keys = Object.keys(multipleFileObject);
    const fileUrlObject : any = {}

    for (let key of keys) {
      this.uploadFile(multipleFileObject[key]).subscribe({
        next: (url) => {
          fileUrlObject[key] = url;
          if( key == keys[keys.length - 1] ) {
            multipleDownloadUrl.next(fileUrlObject)
          }
        },
        error: (err) => {
          multipleDownloadUrl.error(err);
        }
      });
    }
    return multipleDownloadUrl.asObservable();
  }
}
