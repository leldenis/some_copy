import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AccountDto, FleetContactDto, FleetRole } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { FleetContactCardComponent } from '@ui/modules/fleet-profile/components/fleet-contact-card/fleet-contact-card.component';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';

interface GroupedContacts {
  owners: FleetContactDto[];
  managers: FleetContactDto[];
}

const INITIAL_GROUPS: GroupedContacts = { owners: [], managers: [] };

function groupContacts(contacts: FleetContactDto[]): GroupedContacts {
  const groupedContacts = { ...INITIAL_GROUPS };

  contacts.forEach((contact) => {
    groupedContacts[contact.role === FleetRole.OWNER ? 'owners' : 'managers'].push(contact);
  });

  return groupedContacts;
}

@Component({
  selector: 'upf-fleet-contacts',
  standalone: true,
  templateUrl: './fleet-contacts.component.html',
  styleUrls: ['./fleet-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, EmptyStateComponent, FleetContactCardComponent],
})
export class FleetContactsComponent {
  public readonly loggedInUser = input.required<AccountDto>();
  public readonly groupedContacts = input(INITIAL_GROUPS, { transform: groupContacts, alias: 'contacts' });

  public readonly emptyState = EmptyStates;
}
