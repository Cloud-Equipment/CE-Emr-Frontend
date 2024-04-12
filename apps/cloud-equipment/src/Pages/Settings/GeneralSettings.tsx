import React, { useState, useMemo, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Switch, Modal } from '@mui/material';

import {
  Button,
  Input,
  PhoneInputFieldV2,
} from '@cloud-equipment/ui-components';
import * as Assets from '@cloud-equipment/assets';
import { SettingsModal } from '../../Modals';
import { IAppState } from '../../Store/store';
import queries from '../../services/queries/settings';
import { ISettings } from '../../services/queries/settings/types';

type SettingsModalViews = 'changePassword' | 'changePasswordSuccessful' | null;
const GeneralSettings = () => {
  const { user } = useSelector((state: IAppState) => state.auth);

  const { useGetSettings, useUpdateUserSettings } = queries;
  const { data } = useGetSettings(
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
        firstName: data?.firstName,
        lastName: data?.lastName,
        twoFactorEnabled: data?.twoFactorEnabled || false,
        phoneNumber: data?.phoneNumber,
        email: data?.email,
      };
    }, [data]),
  });

  const [settingsModal, setSettingsModal] = useState<{
    currentView: SettingsModalViews;
  }>({ currentView: null });

  const { mutateFn, isLoading: isUpdateLoading } = useUpdateUserSettings();

  useEffect(() => {
    reset({
      id: data?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      twoFactorEnabled: data?.twoFactorEnabled || false,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
    });
  }, [data]);

  // TODO: Change from any to right type
  const onSubmit = (data: any) => {
    delete data.email;
    data.roles = [''];
    mutateFn(data, () => {});
  };

  const OpenSettingsModal = (view: SettingsModalViews) =>
    setSettingsModal({ currentView: view });
  const CloseSettingsModal = () => setSettingsModal({ currentView: null });

  return (
    <div>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <img
          src={Assets.Images.Temp.DummyUserIcon2}
          alt="Profile"
          className="block mt-6 md:mt-10 w-[100px] h-[100px] rounded-full md:w-[140px] md:h-[140px]"
        />
        <div className="mt-4 2xl:mt-6 grid gap-5 2xl:gap-7 md:grid-cols-2">
          <Input
            className="active:border-primary-100 focus:outline-primary-100"
            label="First Name *"
            containerClass="flex-1"
            error={errors.firstName}
            {...register('firstName', {
              required: 'First Name is required',
            })}
          />
          <Input
            className="active:border-primary-100 focus:outline-primary-100"
            label="Last Name *"
            containerClass="flex-1"
            error={errors.lastName}
            {...register('lastName', {
              required: 'Last Name is required',
            })}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{ required: 'Phone Number is required' }}
            render={({ field }) => (
              <PhoneInputFieldV2
                label="Phone Number *"
                id="phoneNumber"
                containerClass="h-[72px] flex-1"
                error={errors?.phoneNumber}
                // disableCountryCode={true}
                {...field}
              />
            )}
          />
          <Input
            className="active:border-primary-100 focus:outline-primary-100"
            label="Email Address *"
            containerClass="flex-1"
            disabled
            {...register('email', {
              required: 'Email Address is required',
            })}
          />
        </div>

        <div className="my-5 2xl:my-8 grid grid-cols-[auto_auto] justify-between gap-x-3 md:gap-x-2 gap-y-5 xl:gap-y-5 md:w-fit 2xl:w-[55%]">
          <p className="font-medium">Admin Position</p>
          <p className="font-semibold text-sm text-center text-greyText2 bg-greyBg rounded-xl px-3 py-2">
            {user?.USER_ROLE?.filter(
              (role) => role?.toLocaleLowerCase() !== 'default'
            )?.[0] || '-'}
          </p>
          <p className="font-medium">Password</p>
          <button
            type="button"
            onClick={() => OpenSettingsModal('changePassword')}
            className="font-semibold text-sm bg-lightGreen text-center text-greenText rounded-xl px-3 py-2"
          >
            Change Password
          </button>
          <p className="font-medium">Two-Factor Authentication</p>
          <Controller
            name="twoFactorEnabled"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onChange={onChange} />
            )}
          />
        </div>

        <Button
          loading={isUpdateLoading}
          label="Save changes"
          variant="primary"
          type="submit"
        />
      </form>
      <Modal open={!!settingsModal.currentView} onClose={CloseSettingsModal}>
        <SettingsModal
          onClose={CloseSettingsModal}
          type={settingsModal.currentView}
          onSubmitPassword={() => {
            OpenSettingsModal('changePasswordSuccessful');
          }}
        />
      </Modal>
    </div>
  );
};

export default GeneralSettings;
