import { SelectionModel } from '@angular/cdk/collections';
import { Directive, EventEmitter, Input, Output, SimpleChange } from '@angular/core';

@Directive()
export abstract class SelectionDirective<T = string> {
  @Input() public selected: T;

  @Output() public readonly selectionChange = new EventEmitter<T>();

  public readonly selection = new SelectionModel<number>();

  protected abstract getSelectionIndex(): number;

  protected handleSelectionChange(change: SimpleChange): void {
    if (change && change?.currentValue) {
      const index = this.getSelectionIndex();
      if (index >= 0) {
        this.selection.select(index);
      } else {
        this.selection.clear();
      }
    } else {
      this.selection.clear();
    }
  }
}
