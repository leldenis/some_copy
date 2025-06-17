import { Faker } from '@faker-js/faker';

export abstract class ModuleBase<T, P = unknown> {
  constructor(protected readonly faker: Faker) {}

  public abstract buildDto(props?: P): T;
}
