import { RouteHandler } from 'cypress/types/net-stubbing';

interface Scenario<P> {
  name: 'ok' | 'bad' | 'custom';
  props?: P;
}

interface OkScenario<P> extends Scenario<P> {
  name: 'ok';
}

interface BadScenario<P> extends Scenario<P> {
  name: 'bad';
}

interface CustomScenario extends Scenario<RouteHandler> {
  name: 'custom';
}

export type InterceptorReturnType<T = any> = Cypress.Chainable<T>;

export abstract class BaseInterceptor<P> {
  protected constructor(
    protected readonly url: string,
    protected readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  ) {}

  public apply<T>(scenario: OkScenario<P> | BadScenario<P> | CustomScenario): InterceptorReturnType<T> {
    if (scenario?.name === 'ok') {
      return this.ok(scenario?.props);
    }

    if (scenario?.name === 'custom') {
      return this.custom(scenario?.props);
    }

    return this.bad(scenario?.props);
  }

  public custom<T>(props: RouteHandler): InterceptorReturnType<T> {
    return this.intercept(props);
  }

  protected intercept<T>(props: RouteHandler): InterceptorReturnType<T> {
    if (!this.method) {
      return cy.intercept(this.url, props);
    }

    return cy.intercept(this.method, this.url, props);
  }

  protected abstract ok<T>(props?: P): InterceptorReturnType<T>;

  protected abstract bad<T>(props?: P): InterceptorReturnType<T>;
}
