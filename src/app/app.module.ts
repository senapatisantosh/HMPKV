import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { routing } from './app.routing';
import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './_helpers';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider,FacebookLoginProvider } from "angularx-social-login";
import { ChartsModule } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { SimpleSidenavModule } from 'simple-sidenav';
import { HtcAnalyticsComponent } from './htc-analytics/htc-analytics.component';
import { AppSettingsService } from './_services/gps.service';



 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("904775593897-u3rh0cg1slm6kpm2qupvoag68brp0at0.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("286105265425905")
  }
]);
 
export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HtcAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    routing,
    BrowserAnimationsModule,
    SocialLoginModule,
    ChartsModule,
    NgxGaugeModule,
    SimpleSidenavModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AuthServiceConfig, useFactory: provideConfig },
    fakeBackendProvider,
    AppSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
