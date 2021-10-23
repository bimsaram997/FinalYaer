import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoadTrialService {
  myUrl = environment.baseUrlTwo;
  constructor(private http: HttpClient) {}

  public saveLoadTrial(obj): Observable<any> {
    return this.http.post(this.myUrl + 'loadTrialRoute/saveLoadTrial', obj);
  }
  public loadTrialEmail(data): Observable<any> {
    return this.http.post(this.myUrl + `loadTrialRoute/loadTrialEmail`, data);
  }
  public makeComment(obj): Observable<any> {
    return this.http.post(this.myUrl + 'loadTrialRoute/makeComment', obj);
  }
  public getLoadTrialAssigned(object): Observable<any> {
    return this.http.get(this.myUrl + 'loadTrialRoute/getLoadTrialAssigned/', {
      params: object,
    });
  }
  getOneLoad(id): Observable<any> {
    return this.http.get<any>(this.myUrl + `loadTrialRoute/getOneLoad/${id}`);
  }

  //comments
  public addComment(data): Observable<any> {
    return this.http.put(this.myUrl + `loadTrialRoute/addComment`, data);
  }
  getAllComments(): Observable<any> {
    return this.http.get<any>(this.myUrl + `loadTrialRoute/getAllComments`);
  }
  pub;
  getRelevantComments(id): Observable<any> {
    return this.http.get<any>(
      this.myUrl + `loadTrialRoute/getLoadComments/${id}`
    );
  }
  public getOneComment(id): Observable<any> {
    return this.http.get<any>(
      this.myUrl + `loadTrialRoute/getOneComment/${id}`
    );
  }
  public changeStatusComment(data): Observable<any> {
    return this.http.put(
      this.myUrl + `loadTrialRoute/changeStatusComment`,
      data
    );
  }

  public getResolvedComments(loadNo): Observable<any> {
    return this.http.get(
      this.myUrl + `loadTrialRoute/getResolvedComments/${loadNo}`
    );
  }

  public commentEmail(data): Observable<any> {
    return this.http.post(this.myUrl + `loadTrialRoute/commentEmail`, data);
  }

  public acceptLoadTrial(loadNo): Observable<any> {
    return this.http.patch(
      this.myUrl + `loadTrialRoute/acceptLoadTrial/${loadNo}`,
      loadNo
    );
  }

  //Feedback

  public addFeedBack(obj): Observable<any> {
    return this.http.post(this.myUrl + 'loadTrialRoute/addFeedback', obj);
  }
  public getOneFeedBack(commentId): Observable<any> {
    return this.http.get<any>(
      this.myUrl + `loadTrialRoute/getOneFeedBack/${commentId}`
    );
  }
  public feedbackEmail(data): Observable<any> {
    return this.http.post(this.myUrl + `loadTrialRoute/feedbackEmail`, data);
  }
}
