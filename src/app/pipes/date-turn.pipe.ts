import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTurn',
  standalone: true,
})
export class DateTurnPipe implements PipeTransform {
  transform(date: Date): unknown {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, '0');

    return `${year}-${day}-${month} ${strHours}:${minutes} ${ampm}`;
  }
}
