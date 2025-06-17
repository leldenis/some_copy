import { inject, Injectable, signal } from '@angular/core';
import { EnvironmentModel } from '@ui-env/environment.model';
import _refiner from 'refiner-js';

import { APP_CONFIG } from '@uklon/angular-core';

export interface RefinerIdentity {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: string;
  city_id: number;
  fleet_name: string;
  fleet_id: string;
}

@Injectable({ providedIn: 'root' })
export class RefinerIntegrationService {
  private readonly projectId = inject<EnvironmentModel>(APP_CONFIG)?.refinerIntegration?.refinerProjectId;
  private readonly initialized = signal(false);

  public initialize(): void {
    if (!this.projectId) return;

    try {
      this.initialized.set(true);
      _refiner('setProject', this.projectId);
    } catch {
      this.initialized.set(false);
      throw new Error('Failed to initialize refiner');
    }
  }

  public identify({ id, email, name, phone_number, role, city_id, fleet_name, fleet_id }: RefinerIdentity): void {
    if (!this.initialized()) return;

    _refiner('identifyUser', {
      id,
      email,
      name,
      phone_number,
      role,
      city_id,
      fleet_name,
      fleet_id,
    });
  }

  public addToResponse({ id, email, name, phone_number, role, city_id, fleet_name, fleet_id }: RefinerIdentity): void {
    if (!this.initialized()) return;

    _refiner('addToResponse', {
      id,
      email,
      name,
      phone_number,
      role,
      city_id,
      fleet_name,
      fleet_id,
    });
  }
}
