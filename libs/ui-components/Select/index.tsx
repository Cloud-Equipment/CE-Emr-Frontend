import {
  ControllerRenderProps,
  FieldValues,
  FieldError,
} from 'react-hook-form';
import cx from 'classnames';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface SelectProps<T extends string>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClass?: string;
  options?: { [key: string]: string }[];
  field?: ControllerRenderProps<FieldValues, T>;
  error?: FieldError;
}

// TODO: fix the validation issue, it does not show because of the default value
const SelectDropdown: React.FC<any> = <T extends string>({
  className,
  label,
  id,
  containerClass,
  options = [],
  field,
  placeholder,
  disabled,
  error,
}: SelectProps<T>) => {
  return (
    <div
      className={cx(
        { 'flex flex-col gap-1': !!label },
        { [`${containerClass}`]: !!containerClass }
        // 'mt-3'
      )}
    >
      {label ? (
        <label
          htmlFor={id}
          className="block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500"
        >
          {label}
        </label>
      ) : null}

      <Select
        className={cx(
          'py-2.5 pr-2 pl-3 rounded-lg focus:outline-none w-full h-12 border',
          className,
          { 'outline-0 outline-red-500 border border-red-500': !!error }
        )}
        inputProps={{ 'aria-label': 'Without label' }}
        disabled={disabled}
        {...field}
      >
        <MenuItem disabled value={0}>
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((x, i) => (
          // REFACTOR: Change this to value and label
          <MenuItem key={i} value={x.categoryId}>
            {x.categoryName}
          </MenuItem>
        ))}
      </Select>
      {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
    </div>
  );
};

export default SelectDropdown;
