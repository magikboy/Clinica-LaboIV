import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritoService {
  private favoriteUsers: IUser[] = [];

  constructor() {
    const storedFavorites = localStorage.getItem('favoriteUsers');
    if (storedFavorites) {
      this.favoriteUsers = JSON.parse(storedFavorites);
    }
  }

  toggleFavoriteUser(user: IUser): void {
    const index = this.favoriteUsers.findIndex((u) => u.uid === user.uid);
    if (index > -1) {
      this.favoriteUsers.splice(index, 1);
    } else {
      this.favoriteUsers.push(user);
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(this.favoriteUsers));
  }

  isFavoriteUser(user: IUser): boolean {
    return this.favoriteUsers.some((u) => u.uid === user.uid);
  }
}
