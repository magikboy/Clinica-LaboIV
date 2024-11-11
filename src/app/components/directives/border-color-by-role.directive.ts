import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appBorderColorByRole]',
  standalone: true
})
export class BorderColorByRoleDirective implements OnChanges {
  @Input() role : string = '';
  constructor(
    private el : ElementRef
  ) { }

  ngOnChanges(): void {
    let color : string;
    if(this.role == 'admin')
    {
      color = 'purple';
    }
    else if(this.role == 'especialista') {
      color = 'red';
    }
    else {
      color = 'blue';
    }

    this.el.nativeElement.style.borderColor = color;
    
  }

}
