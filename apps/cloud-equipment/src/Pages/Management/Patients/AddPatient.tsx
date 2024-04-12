import { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Modal } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import * as Assets from '@cloud-equipment/assets';
import {
  Button,
  Input,
  TextArea,
  DatePicker,
  FileUpload,
  Select,
  PhoneInputFieldV2,
} from '@cloud-equipment/ui-components';
import { AddPatientModal } from '../../../Modals';
import { IAppState } from '../../../Store/store';
import queries from '../../../services/queries/managePatients';
import {
  Gender,
  MaritalStatus,
  PaymentMethod,
  Relationship,
} from '../../../constants';

interface FormProps {
  patientFacilityCode: string;
  patientName: string;
  firstName: string;
  lastName: string;
  patientAge: number;
  patientEmail: string;
  patientPhone: string;
  patientGenderId: number;
  aboutPatient: string;
  maritalStatusId: number;
  bloodGroupId: number;
  dateOfBirth: string;
  dateOfDeath: string;
  address: string;
  isActive: boolean;
  imagePath: string;
  emergencyContactFirstname: string;
  emergencyContactLastName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  emergencyContactRelationshipManual?: string;
  paymentType: string;
  reasonForRegistration: string;
  takingMedication: string;
  additionalNotes: string;
  // registrationDate: string;
  patientUniqueID: string;
  //
  // registrationTime: any;
  // registrationDate: any;
  profilePhoto: File | null;
  [key: string]: any;
}

const NewPatient = () => {
  const { user } = useSelector((state: IAppState) => state.auth);

  const navigate = useNavigate();
  const params = useParams();

  const { useCreatePatient } = queries;
  const { mutateFn, isLoading } = useCreatePatient();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormProps>();

  const [createPatientModalPromptIsOpen, setCreatePatientModalPromptIsOpen] =
    useState(false);

  useEffect(() => {
    if (watch('dateOfBirth')) {
      const age = calculateAge(watch('dateOfBirth'));
      setValue('patientAge', age);
    }
  }, [watch('dateOfBirth')]);

  const onClose = () => {
    setCreatePatientModalPromptIsOpen(false);
  };

  const onSubmit1 = () => {
    setCreatePatientModalPromptIsOpen(true);
  };

  const onSubmit = () => {
    const {
      firstName,
      lastName,
      patientAge,
      patientEmail,
      patientPhone,
      patientGenderId,
      aboutPatient,
      maritalStatusId,
      dateOfBirth,
      address,
      // patientUniqueID,
      emergencyContactFirstname,
      emergencyContactLastName,
      emergencyContactNumber,
      emergencyContactRelationship,
      emergencyContactRelationshipManual,
      paymentType,
      reasonForRegistration,
      takingMedication,
      additionalNotes,
      profilePhoto,
      // registrationDate,
    } = getValues();

    const data: { [key: string]: any } = {
      patientName: `${firstName} ${lastName}`,
      patientAge,
      patientEmail,
      patientPhone,
      patientGenderId,
      aboutPatient,
      maritalStatusId,
      dateOfBirth,
      address,
      // patientUniqueID,
      emergencyContactFirstname,
      emergencyContactLastName,
      emergencyContactNumber,
      emergencyContactRelationship:
        emergencyContactRelationshipManual || emergencyContactRelationship,
      paymentType,
      reasonForRegistration,
      takingMedication: takingMedication === 'no' ? false : true,
      additionalNotes,
      patientFacilityCode: user?.FACILITY_ID || '',
      facilityId: user?.FACILITY_ID || '',
      bloodGroupId: 0,
      isActive: false,
      imagePath: null,
      profilePhoto,
    };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    mutateFn(formData, (res) => {
      onClose();
      navigate(`/management/patient/${res.data.patientUniqueID}`);
    });
  };

  const calculateAge = (date: string) => {
    const selectedDate = dayjs(date);
    const currentDate = dayjs();
    const age = currentDate.diff(selectedDate, 'year');
    return age;
  };

  return (
    <>
      <Modal open={createPatientModalPromptIsOpen} onClose={onClose}>
        <AddPatientModal {...{ onClose, onSubmit }} />
      </Modal>
      <section className="ce-px ce-py">
        <div className="mx-auto xl:w-[90%] 2xl:w-[80%]">
          <div className="flex justify-between items-center">
            <p className="font-medium font-manrope text-2xl leading-[36px] text-neutral-350">
              Add a Patient Information
            </p>
            <Button
              variant="tertiary"
              label="View Patients List"
              onClick={() => navigate('/management/patients')}
              icon={Assets.Icons.ExclamationIcon}
            />
          </div>

          <form
            className="bg-white mt-4 lg:mt-6 px-4 pb-6 md:px-6 md:pb-8 pt-2 rounded-[20px]"
            onSubmit={handleSubmit(onSubmit1)}
          >
            <div className="max-w-[1000px] mx-auto pt-10 grid md:grid-cols-2 gap-3 md:gap-6">
              <Input
                label="Patient ID *"
                placeholder="AGA/453|"
                {...register('patientUniqueID', {
                  required: 'Patient ID is required ',
                })}
                error={errors?.patientUniqueID}
              />
              <div>
                <FileUpload
                  uploadIcon={Assets.Icons.UploadIcon1}
                  containerClass="w-6/12"
                  uploadLabel="Click to Upload Image"
                  setFile={(file) => setValue('profilePhoto', file)}
                />
              </div>
              <Input
                label="Patient First Name *"
                {...register('firstName', {
                  required: 'Patient First Name is required ',
                })}
                error={errors?.firstName}
              />
              <Input
                label="Patient Last Name *"
                {...register('lastName', {
                  required: 'Patient Last Name is required ',
                })}
                error={errors?.lastName}
              />
              <Input
                label="Email Address *"
                {...register('patientEmail', {
                  required: 'Email Address is required ',
                })}
                error={errors?.patientEmail}
              />

              <Controller
                name="patientPhone"
                control={control}
                rules={{ required: 'Phone Number is required' }}
                render={({ field }) => (
                  <PhoneInputFieldV2
                    label="Mobile Number *"
                    id="patientPhone"
                    containerClass="h-[72px]"
                    error={errors?.patientPhone}
                    // disableCountryCode={true}
                    {...field}
                  />
                )}
              />
              <Controller
                name="patientGenderId"
                control={control}
                rules={{ required: 'Gender is required' }}
                // defaultValue={0}
                render={({ field }) => (
                  <Select
                    options={Gender}
                    label="Gender *"
                    placeholder="Select Gender"
                    containerClass="flex-1"
                    error={errors?.patientGenderId}
                    {...{ field }}
                  />
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: 'Date of Birth is required' }}
                render={({ field: { onChange, value, ref } }) => (
                  <DatePicker
                    label="Date of Birth *"
                    containerClass="flex-1"
                    onChange={onChange}
                    onAccept={onChange}
                    value={value}
                    inputRef={ref}
                    error={errors?.dateOfBirth}
                  />
                )}
              />
              <Input
                label="Age *"
                disabled
                placeholder="19 years"
                {...register('patientAge', {
                  required: 'Age is required ',
                })}
                error={errors?.patientAge}
              />

              <Controller
                name="maritalStatusId"
                control={control}
                rules={{ required: 'Marital Status is required' }}
                // defaultValue={0}
                render={({ field }) => (
                  <Select
                    options={MaritalStatus}
                    label="Marital Status *"
                    placeholder="Select Marital Status"
                    error={errors?.maritalStatusId}
                    {...{ field }}
                  />
                )}
              />

              <Input
                label="Address *"
                containerClass="md:col-span-2"
                placeholder="No 24, W. F. Kumuyi Street,"
                {...register('address', {
                  required: 'Address is required ',
                })}
                error={errors?.address}
              />
              <Controller
                name="paymentType"
                control={control}
                rules={{ required: 'Payment Type is required' }}
                // defaultValue={'0'}
                render={({ field }) => (
                  <Select
                    options={PaymentMethod}
                    label="Payment Type *"
                    placeholder="Select Payment Type"
                    error={errors?.paymentType}
                    {...{ field }}
                  />
                )}
              />

              <div className="md:col-span-2 border-b-[2px] pb-1 mt-4 border-b-solid border-borderLine">
                <h4 className="font-bold text-xl">NEXT OF KIN</h4>
                <p className="text-sm text-greyText2 mt-1">
                  You are to populate the Rebate Amount to efficiency calculate
                  a deduction
                </p>
              </div>

              <Input
                label="First Name *"
                {...register('emergencyContactFirstname', {
                  required: 'Emergency First Name is required ',
                })}
                error={errors?.emergencyContactFirstname}
              />
              <Input
                label="Last Name *"
                {...register('emergencyContactLastName', {
                  required: 'Emergency Last Name is required ',
                })}
                error={errors?.emergencyContactLastName}
              />
              <Controller
                name="emergencyContactNumber"
                control={control}
                rules={{ required: 'Emergency Contact Number is required' }}
                render={({ field }) => (
                  <PhoneInputFieldV2
                    label="Contact Number *"
                    id="emergencyContactNumber"
                    containerClass="h-[71px]"
                    error={errors?.emergencyContactNumber}
                    // disableCountryCode={true}
                    {...field}
                  />
                )}
              />

              <Controller
                name="emergencyContactRelationship"
                control={control}
                rules={{ required: 'Relationship is required' }}
                // defaultValue={'0'}
                render={({ field }) => (
                  <Select
                    options={Relationship}
                    label="Relationship *"
                    placeholder="Select Relationship"
                    error={errors?.emergencyContactRelationship}
                    {...{ field }}
                  />
                )}
              />

              {/* TODO: Write logic for the validation, we only want to validate this
              when other is selected */}
              {watch('emergencyContactRelationship') === 'other' && (
                <Input
                  label="Relationship with Next of Kin *"
                  {...register('emergencyContactRelationshipManual', {
                    required: 'Emergency Contact Relationship is required ',
                  })}
                  error={errors?.emergencyContactRelationshipManual}
                />
              )}

              <div className="md:col-span-2 border-b-[2px] pb-1 mt-4 border-b-solid border-borderLine">
                <h4 className="font-bold text-xl">Health History</h4>
              </div>

              <Input
                label="Diagnosis"
                containerClass="col-span-2"
                {...register('reasonForRegistration', {
                  // required: 'Reason for Registration is required ',
                })}
                error={errors?.reasonForRegistration}
              />

              <div className="col-span-2 flex flex-col gap-2">
                <p className="">Taking any medications, Currently?</p>
                <div className="flex gap-4">
                  <label className="flex col-span-2 gap-2">
                    <input
                      type="radio"
                      value="yes"
                      {...register('takingMedication', {
                        required: 'Please Check an option',
                      })}
                      defaultChecked
                    />
                    <p>Yes</p>
                  </label>
                  <label className="flex col-span-2 gap-2 ">
                    <input
                      type="radio"
                      value="no"
                      {...register('takingMedication', {
                        required: 'Please Check an option',
                      })}
                    />
                    <p>No</p>
                  </label>
                </div>
              </div>

              <TextArea
                rows={5}
                label="Additional Notes"
                placeholder="Leave a Note"
                containerClass="md:col-span-2"
                {...register('additionalNotes', {
                  // required: 'Notes is required ',
                })}
                error={errors?.additionalNotes}
              />
            </div>
            <Button
              loading={isLoading}
              className="my-4"
              label="Create Patient Record"
            />
          </form>
        </div>
      </section>
    </>
  );
};

export default NewPatient;
