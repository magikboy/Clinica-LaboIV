import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

export const slideInRightAnimation = trigger('slideInRight', [
    state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
    state('*', style({ transform: 'translateX(0)', opacity: 1 })), // No rotation in the final state
    transition('void => *', [
      animate('400ms ease-out', keyframes([
        style({ opacity: 0.5, transform: 'translateX(50%) rotate(-10deg)', offset: 0.5 }),
        style({ opacity: 1, transform: 'translateX(0) rotate(0deg)', offset: 1.0 }),
      ]))
    ]),
    transition('* => void', [
      animate('400ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
    ])
]);

export const scaleUpAnimation = trigger('scaleUp', [
    state('void', style({ transform: 'scale(0.5)', opacity: 0 })),
    state('*', style({ transform: 'scale(1)', opacity: 1 })),
    transition('void => *', [
      animate('300ms ease-out')
    ]),
    transition('* => void', [
      animate('300ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 }))
    ])
]);