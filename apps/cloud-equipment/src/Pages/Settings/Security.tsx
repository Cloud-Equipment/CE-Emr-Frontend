import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Switch } from '@mui/material';

import { Button } from '@cloud-equipment/ui-components';
import { IAppState } from '../../Store/store';
import queries from '../../services/queries/settings';
import { ISettings } from '../../services/queries/settings/types';

const Security = () => {
  const { user } = useSelector((state: IAppState) => state.auth);

  const { useGetSettings, useUpdateUserSettings } = queries;
  const { isLoading, data } = useGetSettings(
    '/user-manager/account/user/getuserbyid',
    user ? `${user.USER_ID}` : '',
    { enabled: !!user?.USER_ID }
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ISettings>({
    defaultValues: useMemo(() => {
      return {
        id: data?.id,
        emailVerificatioEnabled: data?.emailVerificatioEnabled,
        phoneVerificationEnabled: data?.phoneVerificationEnabled,
      };
    }, [data]),
  });

  return (
    <div className="py-10">
      <h3 className="font-manrope text-lg font-semibold leading-[22px] text-secondary-300 mb-3">
        Two Factor Authentication (2FA)
      </h3>
      <p className="font-manrope text-xs font-normal leading-[18px] text-neutral-550 mb-4">
        If the order reminder function is enabled, it will need to be
        reconfirmed everytime an order is submitted
      </p>

      <div className="flex justify-between mb-8">
        <div className="w-2/12">
          <Controller
            name="phoneVerificationEnabled"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onChange={onChange} />
            )}
          />
        </div>
        <div className="w-8/12 flex flex-col gap-2">
          <h4 className="font-manrope text-base font-semibold leading-[19px] text-secondary-300">
            Phone Number verification
          </h4>
          <p className="text-neutral-550 font-manrope text-xs font-normal leading-[18px]">
            Protect your account and transactions
          </p>
          <span className="text-secondary-350 font-dmsans text-sm font-normal leading-[18px] rounded-2xl px-2 py-1 bg-secondary-750 w-fit">
            Unverified
          </span>
        </div>
        <div className="w-2/12">
          <Button variant="tertiary" label="Enabled" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-2/12">
          <Controller
            name="emailVerificatioEnabled"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onChange={onChange} />
            )}
          />
        </div>
        <div className="w-8/12 flex flex-col gap-2">
          <h4 className="font-manrope text-base font-semibold leading-[19px] text-secondary-300">
            Email Address verification
          </h4>
          <p className="text-neutral-550 font-manrope text-xs font-normal leading-[18px]">
            Protect your account and transactions
          </p>
          <span className="text-secondary-350 font-dmsans text-sm font-normal leading-[18px] rounded-2xl px-2 py-1 bg-secondary-750 w-fit">
            Unverified
          </span>
        </div>
        <div className="w-2/12">
          <Button variant="tertiary" label="Enabled" />
        </div>
      </div>
    </div>
  );
};

export default Security;
