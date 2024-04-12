import React from 'react';

import { Dayjs } from 'dayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import cx from 'classnames';
import { FieldError } from 'react-hook-form';

interface IDatePickerProps extends DatePickerProps<Dayjs | any> {
  label: string | React.ReactElement;
  containerClass?: string;
  className?: string;
  maxDate?: any;
  error?: FieldError;
}

const DatePickerComponent: React.FC<IDatePickerProps> = ({
  label,
  className,
  containerClass,
  maxDate,
  error,
  ...rest
}) => {
  return (
    <div
      className={cx(
        { 'flex flex-col gap-1': !!label },
        { [`${containerClass}`]: !!containerClass },
        ''
      )}
    >
      <label className="block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500">
        {label}
      </label>
      <DatePicker
        className={cx(
          'py-2.5 pr-2 pl-3 rounded-lg focus:outline-none w-full border h-12 [&_input]:h-4',
          className,
          { ' outline-red-500 border border-red-500': !!error }
        )}
        format="DD/MM/YYYY"
        maxDate={maxDate}
        {...rest}
      />
      {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
    </div>
  );
};

export default DatePickerComponent;
