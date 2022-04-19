import { Formik, Field, Form } from 'formik';

import { FormControl } from '@/portainer/components/form-components/FormControl';
import { Widget, WidgetBody, WidgetTitle } from '@/portainer/components/widget';
import { UserViewModel } from '@/portainer/models/user';
import { TeamViewModel } from '@/portainer/models/team';
import { Input } from '@/portainer/components/form-components/Input';
import { UsersSelector } from '@/portainer/components/UsersSelector';
import { LoadingButton } from '@/portainer/components/Button/LoadingButton';

import { validationSchema } from './CreateTeamForm.validation';

export interface FormValues {
  name: string;
  leaders: number[];
}

interface Props {
  users: UserViewModel[];
  teams: TeamViewModel[];
  onSubmit(values: FormValues): void;
}

export function CreateTeamForm({ users, teams, onSubmit }: Props) {
  const initialValues = {
    name: '',
    leaders: [],
  };

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-xs-12">
        <Widget>
          <WidgetTitle icon="fa-plus" title="添加小组" />
          <WidgetBody>
            <Formik
              initialValues={initialValues}
              validationSchema={() => validationSchema(teams)}
              onSubmit={onSubmit}
              validateOnMount
            >
              {({
                values,
                errors,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                isValid,
              }) => (
                <Form
                  className="form-horizontal"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <FormControl
                    inputId="team_name"
                    label="名称"
                    errors={errors.name}
                  >
                    <Field
                      as={Input}
                      name="name"
                      id="team_name"
                      required
                      placeholder="e.g. development"
                      data-cy="team-teamNameInput"
                    />
                  </FormControl>

                  {users.length > 0 && (
                    <FormControl
                      inputId="users-input"
                      label="选择的小组领导"
                      tooltip="您可以为该团队指派一名或多名领导。团队领导者可以管理他们的团队、用户和资源。"
                      errors={errors.leaders}
                    >
                      <UsersSelector
                        value={values.leaders}
                        onChange={(leaders) =>
                          setFieldValue('leaders', leaders)
                        }
                        users={users}
                        dataCy="team-teamLeaderSelect"
                        inputId="users-input"
                        placeholder="选择一个或多个小组领导"
                      />
                    </FormControl>
                  )}

                  <div className="form-group">
                    <div className="col-sm-12">
                      <LoadingButton
                        disabled={!isValid}
                        dataCy="team-createTeamButton"
                        isLoading={isSubmitting}
                        loadingText="正在创建小组..."
                      >
                        <i
                          className="fa fa-plus space-right"
                          aria-hidden="true"
                        />
                        创建小组
                      </LoadingButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
