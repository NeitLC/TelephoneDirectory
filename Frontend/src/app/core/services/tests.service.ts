// import { Injectable } from '@angular/core';
// import {HttpClient, HttpHeaders} from "@angular/common/http";
// import {AppConfigService} from "../configuration/app-config.service";
// import {Observable} from "rxjs";
// import {CreatedTestsGridItem} from "../models/created-tests-grid-item";
// import {CreateTestModel} from "../models/create-test-model";
// import {TestResultsGridItem} from "../models/test-results-grid-item";
// import {AssignedTestsGridItem} from "../models/assigned-tests-grid-item";
// import {TakeTestModel} from "../models/take-test-model";
// import {AnswerTestModel} from "../models/answer-test-model";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class TestsService {
//
//   private testsUrl: string = "tests";
//   private teacherUrl: string = "teacher";
//   private studentUrl: string = "user";
//
//   constructor(private httpClient: HttpClient, private config: AppConfigService) { }
//
//   public getCreatedTests(): Observable<CreatedTestsGridItem[]> {
//     return this.httpClient.get<CreatedTestsGridItem[]>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.teacherUrl}/tests`);
//   }
//
//   public deleteTest(id: string): Observable<any> {
//     return this.httpClient.delete<any>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.teacherUrl}/tests/${id}`);
//   }
//
//   public createTest(test: CreateTestModel): Observable<any> {
//     const headers = new HttpHeaders({'Content-Type': 'application/json'});
//     const requestBody = JSON.stringify(test);
//
//     return this.httpClient.post<any>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.teacherUrl}/tests`, requestBody, {headers: headers});
//   }
//
//   public getTestResults(id: string): Observable<TestResultsGridItem[]> {
//     return this.httpClient.get<TestResultsGridItem[]>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.teacherUrl}/tests/${id}`);
//   }
//
//   public getAssignedTests(): Observable<AssignedTestsGridItem[]> {
//     return this.httpClient.get<AssignedTestsGridItem[]>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.studentUrl}/tests`);
//   }
//
//   public getAssignedTest(testId: string): Observable<TakeTestModel> {
//     return this.httpClient.get<TakeTestModel>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.studentUrl}/tests/${testId}`);
//   }
//
//   public answerTest(answerModel: AnswerTestModel): Observable<any> {
//     const headers = new HttpHeaders({'Content-Type': 'application/json'});
//     const requestBody = JSON.stringify(answerModel);
//
//     return this.httpClient.post<any>(`${this.config.apiBaseUrl}/${this.testsUrl}/${this.studentUrl}/tests`, requestBody, {headers: headers});
//   }
// }
