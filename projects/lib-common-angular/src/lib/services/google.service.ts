/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleService {
  reportConversion(sendTo: string, url?: string): void {
    const callback = () => {
      if (typeof url !== 'undefined') {
        window.location.href = url;
      }
    };
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        send_to: sendTo,
        event_callback: callback
      });
    } else {
      // Si gtag no está disponible, solo redirige
      callback();
    }
  }

  
  reportAnalyticsEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, params || {});
    }
  }
}
