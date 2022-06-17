import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfigPath: string = "assets/configuration/app.config.json";
  private appConfig: any = null;

  constructor(private httpClient: HttpClient) { }

  public loadAppConfig() {
    return this.httpClient.get(this.appConfigPath)
      .toPromise()
      .then((configData) => {
        this.appConfig = configData;
      });
  }

  public get apiBaseUrl() {
    if (this.appConfig == null) {
      throw Error("Config file was not loaded.");
    }

    return this.appConfig.apiBaseUrl;
  }
}
