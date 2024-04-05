import React, { useMemo } from 'react';

import { Control, Controller, FieldError } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import cx from 'classnames';

import 'react-phone-input-2/lib/style.css';

import './phone.scss';

interface PhoneInputProps {
  control: any;
  name: string;
  defaultValue?: string;
  label?: string;
  containerClass?: string;
  readonly?: boolean;
  required?: boolean;
  error?: FieldError;
}

const PhoneInputField = ({
  control,
  name,
  defaultValue,
  label,
  containerClass,
  readonly = false,
  required = true,
  error,
}: PhoneInputProps) => {
  // console.log('control', control._getWatch('patientPhone'));
  //   const phoneCountryFormat = useMemo(() => phoneCountry?.format || undefined, [phoneCountry]);
  // const placeholder = useMemo(() => {
  //   if (phoneCountryFormat) {
  //     const words = phoneCountryFormat.split(' ');
  //     words.shift(); // I'm using only local numbers so here I remove the country code from the format
  //     let text = words.join(' ');
  //      // first digit is special on french numbers, these 3 lines could be removed
  //     // if (country === 'fr') {
  //     //   text = text.replace('.', '6');
  //     // }
  //     while (text.indexOf('.') > -1) {
  //       text = text.replace('.', `${Math.min(9, Math.max(1, Math.floor(Math.random() * 10)))}`);
  //     }
  //     return text;
  //   }
  //   return '';
  // }, [phoneCountryFormat/*, country*/]);
  return (
    <div className={cx({ 'flex flex-col gap-1': !!label })}>
      <div
        className={cx(
          { 'flex flex-col gap-1': !!label },
          { [`${containerClass}`]: !!containerClass }
        )}
      >
        {label ? (
          <label
            className={cx(
              'block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500'
            )}
          >
            {label}
          </label>
        ) : null}
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          disabled={readonly}
          rules={required ? { required: 'This field is required' } : {}}
          render={({ field }) => (
            <PhoneInput
              {...field}
              country={'ng'}
              placeholder="+23492929292"
              inputStyle={!!error ? { border: '1px solid red' } : {}}
              buttonStyle={!!error ? { border: '1px solid red' } : {}}
              enableAreaCodes={true}
              inputProps={{
                name: name,
                // required: required,
                value: field.value?.startsWith('+')
                  ? field.value
                  : field.value
                  ? `+${field.value}`
                  : field.value,
              }}
            />
          )}
        />
        {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
      </div>
    </div>
  );
};

export default PhoneInputField;
