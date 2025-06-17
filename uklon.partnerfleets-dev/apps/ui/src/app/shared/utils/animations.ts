import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

export const GROW_VERTICAL = (time: number = 150): AnimationTriggerMetadata =>
  trigger('growVertical', [
    transition(':enter', [style({ height: '0', opacity: 0 }), animate(time, style({ height: '*', opacity: 1 }))]),
    transition(':leave', [animate(time, style({ height: 0, opacity: 0 }))]),
  ]);

export const FADE_IN = (time: number = 150): AnimationTriggerMetadata =>
  trigger('fadeIn', [
    transition(':enter', [style({ opacity: 0 }), animate(time, style({ opacity: 1 }))]),
    transition(':leave', [animate(time, style({ opacity: 0 }))]),
  ]);
