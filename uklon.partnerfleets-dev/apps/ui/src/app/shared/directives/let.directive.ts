import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

class LetContext<T> {
  public upfLet: T;
}

@Directive({
  selector: '[upfLet]',
  standalone: true,
})
export class LetDirective<T> implements OnInit {
  @Input('upfLet') public set variable(value: T) {
    this.context.upfLet = value;
  }

  private readonly context = new LetContext();

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly template: TemplateRef<LetContext<T>>,
  ) {}

  public static ngTemplateContextGuard<T>(_: LetDirective<T>, ctx: unknown): ctx is LetContext<T> {
    return !!ctx;
  }

  public ngOnInit(): void {
    this.vcr.createEmbeddedView(this.template, this.context);
  }
}
