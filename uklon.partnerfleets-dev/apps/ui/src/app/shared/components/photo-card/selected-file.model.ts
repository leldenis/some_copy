export class SelectedFileModel<T> {
  public category: T;
  public file: File;
  public setLoadingStage?: (state: 'started' | 'success' | 'failed') => void;
}
