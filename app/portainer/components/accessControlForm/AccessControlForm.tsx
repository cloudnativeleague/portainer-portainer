import _ from 'lodash';
import { useEffect, useState, useCallback } from 'react';

import { ResourceControlOwnership as RCO } from '@/portainer/models/resourceControl/resourceControlOwnership';
import { BoxSelector, buildOption } from '@/portainer/components/BoxSelector';
import { ownershipIcon } from '@/portainer/filters/filters';
import { useUser } from '@/portainer/hooks/useUser';
import { Team } from '@/portainer/teams/types';
import { BoxSelectorOption } from '@/portainer/components/BoxSelector/types';
import { FormSectionTitle } from '@/portainer/components/form-components/FormSectionTitle';
import { SwitchField } from '@/portainer/components/form-components/SwitchField';

import { AccessControlFormData } from './model';
import { UsersField } from './UsersField';
import { TeamsField } from './TeamsField';
import { useLoadState } from './useLoadState';

export interface Props {
  values: AccessControlFormData;
  onChange(values: AccessControlFormData): void;
  hideTitle?: boolean;
}

export function AccessControlForm({ values, onChange, hideTitle }: Props) {
  const { users, teams, isLoading } = useLoadState();

  const { user } = useUser();
  const isAdmin = user?.Role === 1;

  const options = useOptions(isAdmin, teams);

  const handleChange = useCallback(
    (partialValues: Partial<typeof values>) => {
      onChange({ ...values, ...partialValues });
    },

    [values, onChange]
  );

  if (isLoading || !teams || !users) {
    return null;
  }

  return (
    <>
      {!hideTitle && <FormSectionTitle>Access control</FormSectionTitle>}

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.accessControlEnabled}
            name="ownership"
            label="启用访问控制"
            tooltip="启用后，可以限制对此资源的访问和管理。"
            onChange={(accessControlEnabled) =>
              handleChange({ accessControlEnabled })
            }
          />
        </div>
      </div>

      {values.accessControlEnabled && (
        <>
          <div className="form-group">
            <BoxSelector
              radioName="access-control"
              value={values.ownership}
              options={options}
              onChange={(ownership) => handleChange({ ownership })}
            />
          </div>
          {values.ownership === RCO.RESTRICTED && (
            <div aria-label="extra-options">
              {isAdmin && (
                <UsersField
                  users={users}
                  onChange={(authorizedUsers) =>
                    handleChange({ authorizedUsers })
                  }
                  value={values.authorizedUsers}
                />
              )}

              {(isAdmin || teams.length > 1) && (
                <TeamsField
                  teams={teams}
                  overrideTooltip={
                    !isAdmin && teams.length > 1
                      ? '由于您是多个团队的成员，您可以选择哪些团队能够管理此资源。'
                      : undefined
                  }
                  onChange={(authorizedTeams) =>
                    handleChange({ authorizedTeams })
                  }
                  value={values.authorizedTeams}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

function useOptions(isAdmin: boolean, teams?: Team[]) {
  const [options, setOptions] = useState<Array<BoxSelectorOption<RCO>>>([]);

  useEffect(() => {
    setOptions(isAdmin ? adminOptions() : nonAdminOptions(teams));
  }, [isAdmin, teams]);

  return options;
}

function adminOptions() {
  return [
    buildOption(
      'access_administrators',
      ownershipIcon('administrators'),
      'Administrators',
      '我想将此资源的管理仅限于管理员',
      RCO.ADMINISTRATORS
    ),
    buildOption(
      'access_restricted',
      ownershipIcon('restricted'),
      'Restricted',
      '我想将此资源的管理限制为一组用户和/或团队',
      RCO.RESTRICTED
    ),
  ];
}
function nonAdminOptions(teams?: Team[]) {
  return _.compact([
    buildOption(
      'access_private',
      ownershipIcon('private'),
      'Private',
      '我希望这个资源只能由我自己管理',
      RCO.PRIVATE
    ),
    teams &&
      teams.length > 0 &&
      buildOption(
        'access_restricted',
        ownershipIcon('restricted'),
        'Restricted',
        teams.length === 1
          ? `我想我小组的任何成员 (${teams[0].Name})  都能够管理资源`
          : '我想将此资源的管理限制在我的一个或多个团队中',
        RCO.RESTRICTED
      ),
  ]);
}
