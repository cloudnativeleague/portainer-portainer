import { Formik, Form } from 'formik';

import { Switch } from '@/portainer/components/form-components/SwitchField/Switch';
import { FormControl } from '@/portainer/components/form-components/FormControl';
import { Select } from '@/portainer/components/form-components/Input/Select';
import { Widget, WidgetBody, WidgetTitle } from '@/portainer/components/widget';
import { LoadingButton } from '@/portainer/components/Button/LoadingButton';
import { TextTip } from '@/portainer/components/Tip/TextTip';

import styles from './SettingsEdgeCompute.module.css';
import { validationSchema } from './SettingsEdgeCompute.validation';

export interface FormValues {
  EdgeAgentCheckinInterval: number;
  EnableEdgeComputeFeatures: boolean;
  DisableTrustOnFirstConnect: boolean;
  EnforceEdgeID: boolean;
}

interface Props {
  settings: FormValues;
  onSubmit(values: FormValues): void;
}

const checkinIntervalOptions = [
  {
    value: 5,
    label: '5 seconds',
  },
  {
    value: 10,
    label: '10 seconds',
  },
  {
    value: 30,
    label: '30 seconds',
  },
];

export function SettingsEdgeCompute({ settings, onSubmit }: Props) {
  const initialValues = {
    EdgeAgentCheckinInterval: settings ? settings.EdgeAgentCheckinInterval : 5,
    EnableEdgeComputeFeatures: settings
      ? settings.EnableEdgeComputeFeatures
      : false,
    DisableTrustOnFirstConnect: settings
      ? settings.DisableTrustOnFirstConnect
      : false,
    EnforceEdgeID: settings ? settings.EnforceEdgeID : false,
  };

  return (
    <div className="row">
      <Widget>
        <WidgetTitle icon="fa-laptop" title="边缘计算设置" />
        <WidgetBody>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={() => validationSchema()}
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
              dirty,
            }) => (
              <Form
                className="form-horizontal"
                onSubmit={handleSubmit}
                noValidate
              >
                <FormControl
                  inputId="edge_checkin"
                  label="边缘计算代理默认拉取设置"
                  size="medium"
                  tooltip="默认情况下，每个边缘代理用于签入ContainerPeacock实例的时间间隔。影响边缘环境管理和边缘计算功能。"
                  errors={errors.EdgeAgentCheckinInterval}
                >
                  <Select
                    value={values.EdgeAgentCheckinInterval}
                    onChange={(e) =>
                      setFieldValue(
                        'EdgeAgentCheckinInterval',
                        parseInt(e.currentTarget.value, 10)
                      )
                    }
                    options={checkinIntervalOptions}
                  />
                </FormControl>

                <FormControl
                  inputId="edge_checkin"
                  label="启动边缘计算功能"
                  size="medium"
                  errors={errors.EnableEdgeComputeFeatures}
                >
                  <Switch
                    id="edge_enable"
                    name="edge_enable"
                    className="space-right"
                    checked={values.EnableEdgeComputeFeatures}
                    onChange={(e) =>
                      setFieldValue('EnableEdgeComputeFeatures', e)
                    }
                  />
                </FormControl>

                <TextTip color="blue">
                  启用时，这将使ContainerPeacock能够执行Edge设备功能。
                </TextTip>

                <FormControl
                  inputId="edge_enforce_id"
                  label="强制执行环境ID"
                  size="medium"
                  errors={errors.EnforceEdgeID}
                >
                  <Switch
                    id="edge_enforce_id"
                    name="edge_enforce_id"
                    className="space-right"
                    checked={values.EnforceEdgeID}
                    onChange={(e) =>
                      setFieldValue('EnforceEdgeID', e.valueOf())
                    }
                  />
                </FormControl>

                <FormControl
                  inputId="edge_tofc"
                  label="信任首次连接"
                  size="medium"
                  errors={errors.DisableTrustOnFirstConnect}
                >
                  <Switch
                    id="edge_disable_tofc"
                    name="edge_disable_tofc"
                    className="space-right"
                    checked={!values.DisableTrustOnFirstConnect}
                    onChange={(e) =>
                      setFieldValue('DisableTrustOnFirstConnect', !e.valueOf())
                    }
                  />
                </FormControl>

                <div className="form-group">
                  <div className="col-sm-12">
                    <LoadingButton
                      disabled={!isValid || !dirty}
                      dataCy="settings-edgeComputeButton"
                      className={styles.saveButton}
                      isLoading={isSubmitting}
                      loadingText="正在保存配置..."
                    >
                      保存设置
                    </LoadingButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </WidgetBody>
      </Widget>
    </div>
  );
}
