import { Controller, useForm } from 'react-hook-form';
import { showToast } from '../../utils/toast';

import { Select, Input } from '../../components';

import { clearLoading, setLoading } from '@cloud-equipment/shared_store';
import * as Assets from '@cloud-equipment/assets';
import { Button } from '@cloud-equipment/ui-components';

interface FormProps {
  email: string;
  role: string;
  [key: string]: string;
}

const CreateUserModal = ({
  onClose,
  procedureToEdit,
}: {
  onClose: () => void;
  procedureToEdit?: any;
}) => {
  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm<FormProps>();

  const onSubmit = (data: FormProps) => {
    console.log('Data', data);
  };

  return (
    <div className="bg-white p-10 lg:p-14 centered-modal-large">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-2">
        <h4 className="font-nunito text-[2.625rem] font-bold leading-[57px] text-neutral-350">
          Create User Facility
        </h4>

        <div className="grid grid-cols-2 gap-10 mb-5">
          <Input
            label="First Name"
            containerClass=""
            placeholder="website@mongoro.com"
            {...register('firstName', {
              required: 'Email is required ',
            })}
          />
          <Input
            label="Last Name"
            containerClass=""
            placeholder="website@mongoro.com"
            {...register('lastName', {
              required: 'Last Name is required ',
            })}
          />

          <label className="flex col-span-2 gap-2">
            <input type="checkbox" />
            <p>Autogenerate Password</p>
          </label>

          <Input
            label="Email Address*"
            containerClass=""
            placeholder="myname@example.com"
            {...register('email', {
              required: 'Email is required ',
            })}
          />
          <Input
            label="Mobile Number*"
            containerClass=""
            placeholder="+234 08143626356"
            {...register('email', {
              required: 'Email is required ',
            })}
          />

          <Controller
            name="gender"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <Select
                options={[
                  {
                    value: 'hey',
                    label: 'hey',
                    categoryName: 'categoryName',
                    categoryId: 'categoryId',
                  },
                ]}
                label="Gender"
                placeHolder="Select Gender"
                {...field}
              />
            )}
          />
          <Controller
            name="userType"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <Select
                options={[
                  {
                    value: 'hey',
                    label: 'hey',
                    categoryName: 'categoryName',
                    categoryId: 'categoryId',
                  },
                ]}
                label="User Type"
                placeHolder="Select User Type"
                {...field}
              />
            )}
          />
          <div className="">
            <Button label="Create User" className="bg-primary-150 md:w-[65%]" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUserModal;