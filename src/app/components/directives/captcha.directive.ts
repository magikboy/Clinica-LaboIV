import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective {
  @Input() isEnabled: boolean = true;
  @Output() captchaValidated = new EventEmitter<boolean>();

  private captchaChallenge: string = '';
  private captchaInput: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.isEnabled) {
      this.generateCaptcha();
    }
  }

  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    this.captchaChallenge = `${num1} + ${num2}`;

    const captchaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(captchaContainer, 'display', 'flex');
    this.renderer.setStyle(captchaContainer, 'flexDirection', 'column');
    this.renderer.setStyle(captchaContainer, 'alignItems', 'center');
    this.renderer.setStyle(captchaContainer, 'padding', '10px');
    this.renderer.setStyle(captchaContainer, 'border', '1px solid #ccc');
    this.renderer.setStyle(captchaContainer, 'borderRadius', '8px');
    this.renderer.setStyle(captchaContainer, 'boxShadow', '3px 1px 44px 0px rgba(110,24,24,0.75)');
    this.renderer.setStyle(captchaContainer, 'width', '100%');
    this.renderer.setStyle(captchaContainer, 'maxWidth', '300px');

    const captchaText = this.renderer.createElement('p');
    this.renderer.setStyle(captchaText, 'fontSize', '16px');
    this.renderer.setStyle(captchaText, 'marginBottom', '10px');
    this.renderer.setProperty(captchaText, 'innerText', `Resolve: ${this.captchaChallenge}`);

    const captchaInput = this.renderer.createElement('input');
    this.renderer.setAttribute(captchaInput, 'type', 'text');
    this.renderer.setAttribute(captchaInput, 'placeholder', 'Respuesta');
    this.renderer.setStyle(captchaInput, 'padding', '8px');
    this.renderer.setStyle(captchaInput, 'border', '1px solid #ccc');
    this.renderer.setStyle(captchaInput, 'borderRadius', '4px');
    this.renderer.setStyle(captchaInput, 'width', '100%');
    this.renderer.setStyle(captchaInput, 'boxSizing', 'border-box');
    this.renderer.setStyle(captchaInput, 'marginBottom', '10px');
    this.renderer.setProperty(captchaInput, 'className', 'captcha-input');

    const verifyButton = this.renderer.createElement('button');
    this.renderer.setStyle(verifyButton, 'padding', '8px 16px');
    this.renderer.setStyle(verifyButton, 'border', 'none');
    this.renderer.setStyle(verifyButton, 'borderRadius', '4px');
    this.renderer.setStyle(verifyButton, 'backgroundColor', '#007bff');
    this.renderer.setStyle(verifyButton, 'color', 'white');
    this.renderer.setStyle(verifyButton, 'cursor', 'pointer');
    this.renderer.setStyle(verifyButton, 'fontSize', '14px');
    this.renderer.setProperty(verifyButton, 'innerText', 'Verify');
    this.renderer.setProperty(verifyButton, 'className', 'captcha-verify');

    this.renderer.appendChild(captchaContainer, captchaText);
    this.renderer.appendChild(captchaContainer, captchaInput);
    this.renderer.appendChild(captchaContainer, verifyButton);
    this.renderer.appendChild(this.el.nativeElement, captchaContainer);
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (!this.isEnabled) return;

    const target = event.target as HTMLElement;
    if (target.classList.contains('captcha-verify')) {
      const inputElem = this.el.nativeElement.querySelector('.captcha-input') as HTMLInputElement;
      this.captchaInput = inputElem.value;
      this.verifyCaptcha();
    }
  }

  verifyCaptcha() {
    const [num1, num2] = this.captchaChallenge.split(' + ').map(Number);
    const correctAnswer = num1 + num2;

    if (parseInt(this.captchaInput, 10) === correctAnswer) {
      this.captchaValidated.emit(true);
    } else {
      this.captchaValidated.emit(false);
      this.generateCaptcha();
    }
  }
}
