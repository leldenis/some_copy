import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export class CSVFileRef {
  private readonly blob = new BehaviorSubject<string>(undefined);
  private readonly success = new BehaviorSubject<string>(undefined);
  private readonly error = new BehaviorSubject<boolean>(undefined);

  constructor(
    private readonly csvFileData: Observable<string>,
    private readonly filename: string,
    private readonly downloadFn: (fileData: string) => void,
  ) {
    this.csvFileData.subscribe({
      next: (fileData) => {
        this.success.next(this.filename);
        this.blob.next(fileData);
      },
      error: (err) => {
        console.error(err);
        this.error.next(true);
      },
    });
  }

  public hasError(): Observable<boolean> {
    return this.error.pipe(filter((v) => v !== undefined));
  }

  public isSuccessful(): Observable<string> {
    return this.success.pipe(filter((v) => v !== undefined));
  }

  public download(): void {
    if (this.blob.closed) {
      return;
    }

    this.blob.pipe(filter(Boolean), take(1)).subscribe({
      next: (fileData) => {
        this.downloadFn(fileData);
      },
      complete: () => this.destroy(),
    });
  }

  private destroy(): void {
    this.blob.complete();
    this.error.complete();
    this.success.complete();
  }
}
