import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './ui/ui.module';
import {AppConfigService} from "./core/configuration/app-config.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AdminGuard} from "./core/guards/admin.guard";
import {TokenInterceptorService} from "./core/services/token-interceptor.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    HttpClientModule
  ],
  providers: [AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        }
      },
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
