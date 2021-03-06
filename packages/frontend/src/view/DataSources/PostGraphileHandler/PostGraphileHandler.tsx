import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormGroup } from '@material-ui/core';

import { Checkbox, Input, PrimaryButton } from '../../../ui';
import { usePostGraphileHandler } from '../../../presenter/DataSources';
import { HandlerStep } from '../../../types';
import { HandlerCol, HandlerRow } from '../Layout';
import { ObjectArray, StringArray } from '../../Form';
import { getError } from '../helpers';

export const PostGraphileHandler: React.FC<HandlerStep> = (props) => {
  const {
    control,
    errors,
    onSubmit,
    poolFields,
    appendPoolField,
    removePoolField,
    optionsFields,
    appendOptionsField,
    removeOptionsField,
    appendPluginsFields,
    appendAppendPluginsField,
    removeAppendPluginsField,
    skipPluginsFields,
    appendSkipPluginsField,
    removeSkipPluginsField,
    schemaNameFields,
    appendSchemaNameField,
    removeSchemaNameField,
  } = usePostGraphileHandler(props);
  const hasErrors = getError(errors);

  return (
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <HandlerRow>
        <HandlerCol>
          <Controller
            as={Input}
            control={control}
            label="Connection String"
            required
            name="connectionString"
            error={hasErrors('connectionString')}
            fullWidth
          />
        </HandlerCol>
      </HandlerRow>
      <HandlerRow>
        <HandlerCol>
          <FormControl>
            <FormGroup>
              <FormControlLabel
                label="Cache Introspection"
                control={
                  <Controller
                    name="cacheIntrospection"
                    control={control}
                    defaultValue={false}
                    render={(props) => <Checkbox {...props} color="primary" />}
                  />
                }
              />
            </FormGroup>
          </FormControl>
        </HandlerCol>
      </HandlerRow>
      <StringArray
        title="Append plugins"
        name="appendPlugins"
        control={control}
        errors={errors}
        fields={appendPluginsFields}
        onAdd={appendAppendPluginsField}
        onRemove={removeAppendPluginsField}
      />
      <StringArray
        title="Skip plugins"
        name="skipPlugins"
        control={control}
        errors={errors}
        fields={skipPluginsFields}
        onAdd={appendSkipPluginsField}
        onRemove={removeSkipPluginsField}
      />
      <StringArray
        title="Schema name"
        name="schemaName"
        control={control}
        errors={errors}
        fields={schemaNameFields}
        onAdd={appendSchemaNameField}
        onRemove={removeSchemaNameField}
      />
      <ObjectArray
        title="Connection pool settings"
        name="pool"
        control={control}
        errors={errors}
        fields={poolFields}
        onAdd={appendPoolField}
        onRemove={removePoolField}
      />
      <ObjectArray
        title="Options"
        name="options"
        control={control}
        errors={errors}
        fields={optionsFields}
        onAdd={appendOptionsField}
        onRemove={removeOptionsField}
      />
      <PrimaryButton type="submit">Save Handler</PrimaryButton>
    </form>
  );
};
