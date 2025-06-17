import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AuthenticationDomainModule {}
