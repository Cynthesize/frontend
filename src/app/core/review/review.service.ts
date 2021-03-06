import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { take, map } from 'rxjs/operators';
import {
  QUERY_IDEATION_CHECKPOINT_ANSWERS,
  QUERY_PRODUCT_DEVELOPMENT_CHECKPOINT_ANSWERS,
  QUERY_FEEDBACK_CHECKPOINT_ANSWERS,
  QUERY_LAUNCHING_CHECKPOINT_ANSWERS,
  QUERY_FUNDING_CHECKPOINT_ANSWERS,
  QUERY_MENTOR_FEEDBACK_ANSWERS
} from '@app/shared/queries/review-queries';
import { AuthenticationService } from '../authentication/authentication.service';
import { MUTATION_ACTION_ON_CHECKPOINT } from '@app/shared/mutations/review-mutation';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private apollo: Apollo, private authService: AuthenticationService) {}

  /**
   * getReviewAnswers
   */
  public getReviewAnswers(checkpointName: string) {
    let checkpoint = QUERY_IDEATION_CHECKPOINT_ANSWERS;
    switch (checkpointName) {
      case 'Ideation':
        checkpoint = QUERY_IDEATION_CHECKPOINT_ANSWERS;
        break;
      case 'Prototyping':
        checkpoint = QUERY_PRODUCT_DEVELOPMENT_CHECKPOINT_ANSWERS;
        break;
      case 'Feedback':
        checkpoint = QUERY_FEEDBACK_CHECKPOINT_ANSWERS;
        break;
      case 'Launching':
        checkpoint = QUERY_LAUNCHING_CHECKPOINT_ANSWERS;
        break;
      case 'Funding':
        checkpoint = QUERY_FUNDING_CHECKPOINT_ANSWERS;
        break;
      default:
        break;
    }
    return this.apollo
      .query<any>({
        query: checkpoint,
        variables: {
          mentorId: this.authService.user_id
        }
      })
      .pipe(take(1))
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * actionOnCheckpointByMentor
   */
  public actionOnCheckpointByMentor(
    reviewComment: string,
    stageId: number,
    stageType: string,
    is_approved: boolean,
    projectId: number
  ) {
    const mutationObject = {
      is_approved: is_approved,
      mentor_id: this.authService.user_id,
      review_comments: reviewComment,
      project_id: projectId
    };
    switch (stageType) {
      case 'Ideation':
        mutationObject['ideation_stage_id'] = stageId;
        break;
      case 'Prototyping':
        mutationObject['product_development_id'] = stageId;
        break;
      case 'Feedback':
        mutationObject['consumer_feedback_stage_id'] = stageId;
        break;
      case 'Launching':
        mutationObject['launching_stage_id'] = stageId;
        break;
      case 'Funding':
        mutationObject['funding_stage_id'] = stageId;
        break;
      default:
        break;
    }
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ACTION_ON_CHECKPOINT,
        variables: {
          objects: mutationObject
        }
      })
      .pipe(take(1))
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * fetchReviewAnswersByMentors
   */
  public fetchReviewAnswersByMentors(projectId: number) {
    return this.apollo
      .query<any>({
        query: QUERY_MENTOR_FEEDBACK_ANSWERS,
        variables: {
          projectId: projectId
        }
      })
      .pipe(take(1))
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
