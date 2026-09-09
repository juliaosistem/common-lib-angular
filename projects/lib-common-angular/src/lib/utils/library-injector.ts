import { Injector } from '@angular/core';

let libraryInjector: Injector | null = null;

export function setLibraryInjector(injector: Injector) {
  libraryInjector = injector;
}

export function getLibraryInjector(): Injector {
  if (!libraryInjector) {
    throw new Error('Library injector not initialized. Call setLibraryInjector(injector) from the host application AppModule.');
  }
  return libraryInjector;
}
