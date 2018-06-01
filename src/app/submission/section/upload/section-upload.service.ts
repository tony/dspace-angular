import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { DeleteUploadedFileAction, EditFileDataAction, NewUploadedFileAction } from '../../objects/submission-objects.actions';
import {
  submissionUploadedFileFromUuidSelector,
  submissionUploadedFilesFromIdSelector
} from '../../selectors';
import { isUndefined } from '../../../shared/empty.util';
import { WorkspaceitemSectionUploadFileObject } from '../../../core/submission/models/workspaceitem-section-upload-file.model';

@Injectable()
export class SectionUploadService {

  constructor(private store: Store<SubmissionState>) {}

  public getUploadedFileList(submissionId: string, sectionId: string): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getFileData(submissionId: string, sectionId: string, fileUuid: string): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId))
      .filter((state) => !isUndefined(state))
      .map((state) => {
        let fileState;
        Object.keys(state)
          .filter((key) => state[key].uuid === fileUuid)
          .forEach((key) => fileState = state[key]);
        return fileState;
      })
      .distinctUntilChanged();
  }

  public getDefaultPolicies(submissionId: string, sectionId: string, fileId: string): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, fileId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public addUploadedFile(submissionId: string, sectionId: string, fileId: string, data: WorkspaceitemSectionUploadFileObject) {
    this.store.dispatch(
      new NewUploadedFileAction(submissionId, sectionId, fileId, data)
    );
  }

  public updateFileData(submissionId: string, sectionId: string, fileId: string, data: WorkspaceitemSectionUploadFileObject) {
    this.store.dispatch(
      new EditFileDataAction(submissionId, sectionId, fileId, data)
    );
  }

  public removeUploadedFile(submissionId: string, sectionId: string, fileId: string) {
    this.store.dispatch(
      new DeleteUploadedFileAction(submissionId, sectionId, fileId)
    );
  }
}