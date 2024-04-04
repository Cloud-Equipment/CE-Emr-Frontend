import { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { UserTypeEnum } from '@cloud-equipment/models';
import { IAppState } from '../../../Store/store';
import queries from '../../../services/queries/manageUsers';
import {
  Button,
  Input,
  PhoneInputField,
  Select,
  DatePicker,
} from '@cloud-equipment/ui-components';
import * as Assets from '@cloud-equipment/assets';

export const EditUserModal = ({ onClose, data }: any) => {
  const [activeModal, setActiveModal] = useState<
    'editModal' | 'confirmEditUser'
  >('editModal');

  const { register, handleSubmit, control, getValues, reset } = useForm<any>({
    defaultValues: useMemo(() => {
      return {
        id: data?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        roles: data?.roles?.[0],
        dateOfHire: data?.dateOfHire,
      };
    }, [data]),
  });

  useEffect(() => {
    reset({
      id: data?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      twoFactorEnabled: data?.twoFactorEnabled || false,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
      roles: data?.roles?.[0],
      dateOfHire: data?.dateOfHire,
    });
  }, [data]);

  const userDetails = useSelector((state: IAppState) => state.auth.user);

  const { useUpdateUser } = queries;
  const { mutateFn, isLoading } = useUpdateUser();

  const EditUser = () => {
    const data = getValues();
    mutateFn(
      {
        ...data,
        id: data?.id,
        facilityId: userDetails?.FACILITY_ID,
        roles: [data.roles],
      },
      () => onClose()
    );
  };

  const onSubmit = () => {
    setActiveModal('confirmEditUser');
  };

  return (
    <>
      {activeModal === 'editModal' ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-10 centered-modal-md"
        >
          <>
            <h4 className="font-dmsans text-2xl font-bold leading-9 text-secondary-350 mb-4">
              Create Team Members
            </h4>

            <div className="flex flex-col gap-5">
              <Input
                label="First Name *"
                placeholder="Enter First Name"
                className="ce-input"
                {...register('firstName')}
              />
              <Input
                label="Last Name *"
                placeholder="Enter Last Name"
                className="ce-input"
                {...register('lastName')}
              />
              <Input
                label="Email *"
                placeholder="Enter Email Address"
                className="ce-input"
                {...register('email')}
              />
              <PhoneInputField
                control={control}
                label="Phone Number *"
                name="phoneNumber"
                containerClass="h-[74px]"
              />
              <Controller
                name="dateOfHire"
                control={control}
                // defaultValue={0}
                // rules={{ required: 'Date of Hire is required' }}
                render={({ field: { onChange, value, ref } }) => (
                  <DatePicker
                    label="Registration Date *"
                    containerClass="flex-1"
                    onChange={onChange}
                    onAccept={onChange}
                    value={value}
                    inputRef={ref}
                    disabled
                  />
                )}
              />
              <Controller
                name="roles"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Select
                    options={[
                      {
                        value: UserTypeEnum.FACILITY_ADMIN,
                        label: 'Facility Admin',
                        categoryId: UserTypeEnum.FACILITY_ADMIN,
                        categoryName: 'Facility Admin',
                      },
                      {
                        value: UserTypeEnum.RECEPTIONIST,
                        label: 'Receptionist',
                        categoryId: UserTypeEnum.RECEPTIONIST,
                        categoryName: 'Receptionist',
                      },
                    ]}
                    label="Role *"
                    placeholder="Select Role"
                    containerClass="flex-1"
                    disabled={true}
                    {...{ field }}
                  />
                )}
              />
            </div>

            <div className="flex justify-center">
              <Button
                loading={isLoading}
                className="mt-4"
                label="Edit Team Member"
              />
            </div>
          </>
        </form>
      ) : (
        <>
          <div className="bg-white p-10 lg:p-14 flex flex-col items-center gap-5 centered-modal">
            <img
              alt="icon"
              className="w-15 h-15"
              src={Assets.Icons.EnableEMRIcon}
            />
            <p className="text-center">
              Are you sure you want to Edit the user
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="tertiary"
                label="Cancel"
                className="text-secondary-400"
                onClick={onClose}
              />
              <Button
                variant="neutral"
                label="Yes"
                className="border-primary-150 hover:border-primary-150 text-primary-150 hover:text-primary-150"
                onClick={EditUser}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
