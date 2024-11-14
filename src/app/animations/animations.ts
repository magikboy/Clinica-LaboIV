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


export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),
  transition('void => *', [
    animate('300ms ease-in')
  ]),
  transition('* => void', [
    animate('300ms ease-out')
  ])
]);


export const SlideUpAnimation = trigger('slideUp', [
  state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
  state('*', style({ transform: 'translateY(0)', opacity: 1 })),
  transition('void => *', [
    animate('600ms ease-out', keyframes([
      style({ opacity: 0.5, transform: 'translateY(50%)', offset: 0.5 }),
      style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
    ]))
  ]),
  transition('* => void', [
    animate('400ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);


export const bounceInAnimation = trigger('bounceIn', [
  state('void', style({ transform: 'scale(0)', opacity: 0 })),
  state('*', style({ transform: 'scale(1)', opacity: 1 })),
  transition('void => *', [
    animate('600ms ease-out', keyframes([
      style({ transform: 'scale(0.3)', opacity: 1, offset: 0.3 }),
      style({ transform: 'scale(1.05)', opacity: 1, offset: 0.5 }),
      style({ transform: 'scale(0.9)', opacity: 1, offset: 0.7 }),
      style({ transform: 'scale(1)', opacity: 1, offset: 1.0 }),
    ]))
  ]),
  transition('* => void', [
    animate('300ms ease-in', style({ transform: 'scale(0)', opacity: 0 }))
  ])
]);