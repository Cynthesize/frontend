import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import BACKEND_URLS from '@app/shared/backend-urls';
import { map } from 'rxjs/operators';
import { IssueComments } from '@app/shared/objects';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `JWT ${JSON.parse(localStorage.getItem('credentials'))['token']}`
    })
  };
  constructor(private http: HttpClient) {}

  /**
   * ADD A PROJECT
   */
  public addProject(projectDetails: Object) {
    const projectDetailsObject = {
      project_name: projectDetails['projectName'],
      project_id: projectDetails['projectId'],
      description: projectDetails['description'],
      current_stage: projectDetails['currentStage'],
      owner: JSON.parse(localStorage.getItem('credentials'))['user_id']
    };
    return this.http.post<any>(BACKEND_URLS.PROJECT, projectDetailsObject, this.httpOptions).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );
  }

  /**
   * GET PROJECT DETAILS
   */
  public getProject(id: string) {
    return this.http
      .get(BACKEND_URLS.PROJECT, {
        params: {
          id: id
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * FETCH IDEA
   */
  public fetchIdea(idList: string) {
    return this.http
      .get(BACKEND_URLS.FETCH_ISSUE_OBJECT, {
        params: {
          id: idList
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * Add Comments for an issue in the project.
   */
  public addComment(commentText: string, projectId: string, issueId: string) {
    const IssueComment = {
      comment_text: commentText,
      project_id: projectId,
      issue_id: issueId,
      commenter: JSON.parse(localStorage.getItem('credentials'))['user_id']
    };
    return this.http.post<any>(BACKEND_URLS.ADD_ISSUE_COMMENT, IssueComment, this.httpOptions).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );
  }
}