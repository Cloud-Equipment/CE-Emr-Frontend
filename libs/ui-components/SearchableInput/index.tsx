import React from 'react';

import { Autocomplete, MenuItem, TextField } from '@mui/material';
import cx from 'classnames';

import * as Assets from '@cloud-equipment/assets';
import { FieldError } from 'react-hook-form';

interface SearchableInputProps {
  options: any[];
  label: string;
  containerClass?: string;
  inputValue: string; // value displayed in the input field.. especially when prefilling the form (state handled from parent)
  onInputChange: (value: string) => void; // emit event to parent when the user types into the field
  onOptionSelect: (selectedOption: any) => void; // emit to parent when user selects an option from dropdown
  optionLabelKey: string; // property to check for as the displayed value of an option
  isDoctor?: boolean; // very temporal,, we should pass an element ref instead, to render the option label
  error?: FieldError;
}

const SearchableInput = ({
  options,
  label,
  onInputChange,
  inputValue,
  onOptionSelect,
  optionLabelKey,
  containerClass,
  isDoctor,
  error,
}: SearchableInputProps) => {
  return (
    <div
      className={cx(
        { 'flex flex-col gap-1': !!label },
        { [`${containerClass}`]: !!containerClass }
      )}
    >
      <label>{label}</label>
      <Autocomplete
        freeSolo
        options={options ?? []}
        className={cx({ 'border border-red-500 rounded-lg': !!error })}
        // onInputChange={(event, newInputValue) => {
        //   setPatientName(newInputValue);
        // }}
        onInputChange={(event, newInputValue) => {
          onInputChange(newInputValue);
        }}
        // onChange={(event, selectedOption) => {
        //   handleSelectedPatientFromSearch(selectedOption as unknown as any);
        // }}
        onChange={(event, selectedOption) => {
          onOptionSelect(selectedOption);
        }}
        renderInput={(params: any) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
            }}
            className={cx(
              'py-2.5 pr-2 pl-3 rounded-lg focus:outline-none w-full h-12 border',
              { 'outline-red-500 border border-red-500': error }
            )}
          />
        )}
        getOptionLabel={(option) => {
          return option[optionLabelKey];
        }}
        renderOption={(props, option: any) => (
          <MenuItem {...props}>
            <div className="rounded flex items-center space-x-5 px-3 py-2">
              <img
                src={Assets.Icons.DummyUser}
                className="w-10 rounded-[10px]"
                alt=""
              />

              <div>
                <p className="font-semibold text-sm">
                  {option[optionLabelKey]}
                </p>
                {isDoctor ? (
                  <>
                    <p className="text-xs">{option.doctorEmail}</p>
                    <p className="text-xs font-semibold">
                      {option.doctorHospital}
                    </p>
                  </>
                ) : (
                  <p className="text-xs mt-2">
                    {option.patientFacilityCode?.substr(0, 5)} .{' '}
                    {option.patientAge} Years
                  </p>
                )}
              </div>
            </div>
          </MenuItem>
        )}
      />
      {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
    </div>
  );
};

export default SearchableInput;
