import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appStatNumber]',
  standalone: true
})
export class StatNumberDirective implements OnInit {
  @Input() number! : number;
  constructor(private el : ElementRef) {}

  ngOnInit(): void {
    if(this.number > 15)
      {
        this.el.nativeElement.style.color = 'red';
      }
  }

}
