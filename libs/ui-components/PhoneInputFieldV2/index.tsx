import React, { useMemo } from 'react';

import { Control, Controller, FieldError } from 'react-hook-form';
import PhoneInput, {
  PhoneInputProps as PhoneInputPropsMain,
} from 'react-phone-input-2';
import cx from 'classnames';

import 'react-phone-input-2/lib/style.css';

import './phone.scss';

interface PhoneInputProps extends PhoneInputPropsMain {
  name: string;
  defaultValue?: string;
  label?: string;
  containerClass?: string;
  readonly?: boolean;
  required?: boolean;
  error?: FieldError;
  id: string;
  className?: string;
}

const PhoneInputField = ({
  name,
  defaultValue,
  label,
  containerClass,
  readonly = false,
  required = true,
  error,
  id,
  className,
  ...rest
}: PhoneInputProps) => {
  return (
    <div
      className={cx(
        { 'flex flex-col gap-1': !!label },
        { [`${containerClass}`]: !!containerClass }
      )}
    >
      {label ? (
        <label
          htmlFor={id}
          className={cx(
            'block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500'
          )}
        >
          {label}
        </label>
      ) : null}
      <PhoneInput
        {...rest}
        country={'ng'}
        placeholder="+23492929292"
        inputStyle={!!error ? { border: '1px solid red' } : {}}
        buttonStyle={!!error ? { border: '1px solid red' } : {}}
        enableAreaCodes={true}
        inputProps={{
          name: name,
          // required: required,
          value: rest.value?.startsWith('+')
            ? rest.value
            : rest.value
            ? `+${rest.value}`
            : rest.value,
        }}
      />
      {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
    </div>
  );
};

export default PhoneInputField;
