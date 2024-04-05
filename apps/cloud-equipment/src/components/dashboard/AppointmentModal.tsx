import React, { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Select as MatSelect,
} from '@mui/material';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import numeral from 'numeral';
import { useSelector } from 'react-redux';

import * as Assets from '@cloud-equipment/assets';
import {
  // DatePicker,
  Input,
  Select,
  // TimePicker,
  // TextArea,
  Button,
  PhoneInputField,
  SearchableInput,
  MultiSelectWithCheckbox,
  TextArea,
} from '@cloud-equipment/ui-components';
import medserviceQueries from '../../services/queries/medservices';
import patientQueries from '../../services/queries/managePatients';
import apppointmentQueries from '../../services/queries/appointments';
import refererQueries from '../../services/queries/manageReferers';
import { IMedservice, IPatient } from '@cloud-equipment/models';
import { IAppState } from '../../Store/store';
import { ReportsPriceBreakdown } from './ReportsPriceBreakdown';
import { Gender, MaritalStatus } from '../../constants';
import { environment } from '@cloud-equipment/environments';
import { useFilters } from '@cloud-equipment/hooks';

interface FormProps {
  patientName: string;
  patientNumber: string;
  patientEmail: string;
  patientGenderId: number;
  patientAge: number;
  maritalStatusId: number;
  patientBloodGroup: string;
  bloodPressure: string;
  pulse: string;
  takingMeds: boolean;
  [key: string]: any;
}

const AppointmentModal = ({ onClose }: { onClose: () => void }) => {
  const userDetails = useSelector((state: IAppState) => state.auth.user);

  //   patients , search patients and create patients related data and functions
  const [patientName, setPatientName] = useState('');
  const [existingPatientId, setExistingPatientId] = useState<string | null>(
    null
  );

  const { useSearchPatientByName, useCreatePatient } = patientQueries;
  const { data: patientsFound } = useSearchPatientByName(
    patientName,
    userDetails?.FACILITY_ID as string
  );

  const { mutateFn: mutateFn_CreatePatient, isLoading: isCreatingPatient } =
    useCreatePatient();

  const handleSelectedPatientFromSearch = (selectedPatient: IPatient) => {
    // setValue('patientId', selectedPatient?.patientUniqueID);
    setValue('patientName', selectedPatient?.patientName);
    setValue('patientNumber', selectedPatient?.patientPhone);
    setValue('patientAge', selectedPatient?.patientAge);
    setValue('patientGenderId', selectedPatient?.patientGenderId);
    setValue('patientEmail', selectedPatient?.patientEmail);

    setExistingPatientId(selectedPatient?.patientUniqueID);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearPatientFound = () => {
    setValue('patientNumber', '');
    setValue('patientAge', '' as unknown as number);
    setValue('patientGenderId', '' as unknown as number);
    setValue('patientEmail', '');

    setExistingPatientId(null);
  };

  //   doctors , search doctors and create doctors related data and functions
  const [refererName, setRefererName] = useState('');
  const [existingRefererId, setExistingRefererId] = useState<string | null>(
    null
  );

  const { useSearchRefererByName, useCreateReferer } = refererQueries;
  const { data: referersFound } = useSearchRefererByName(refererName);

  const { mutateFn: mutateFn_CreateReferer, isLoading: isCreatingReferer } =
    useCreateReferer();

  const handleSelectedRefererFromSearch = (selectedReferer: any) => {
    setValue('refererName', selectedReferer?.doctorName);
    setValue('refererHospital', selectedReferer?.doctorHospital);
    setValue('refererEmail', selectedReferer?.doctorEmail);
    setValue('refererPhone', selectedReferer?.doctorPhone);

    setExistingRefererId(selectedReferer?.doctorId);
  };

  const { useCreateAppointment } = apppointmentQueries;
  const { mutateFn: mutateFn_CreateAppointment } = useCreateAppointment();

  const { useGetMedservicesForFacility } = medserviceQueries;
  const {
    url,
    // filters: { currentPage, pageSize },
    // setFilters,
  } = useFilters(
    environment.baseUrl,
    '/service-manager/medServices/getallbyfacilitypaged'
  );
  const { data: proceduresList, isLoading } = useGetMedservicesForFacility(
    `${url}`,
    {
      facilityId: userDetails?.FACILITY_ID as string,
      download: false,
      currentPage: 1,
      startIndex: 0,
      pageSize: 1000,
    }
  );

  const [createPromptIsOpen, setCreatePromptIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormProps>();
  const [appointmentDate, setAppointmentDate] = useState<Dayjs | null>(null);

  const onSubmit = () => {
    setCreatePromptIsOpen(true);
  };

  const submitData = async () => {
    const createAppointment = (patientId: string, refererId: string | null) => {
      const proceduresToSubmit: any[] = [];
      const data_ = getValues();
      selectedProcedures.forEach((x) => {
        const rebateInfo = proceduresWithRebate.find((y) => y === x);
        const item_: any = {
          patientId: patientId,
          medServiceId: x,
          quantity: 1,
          amount: proceduresList?.resultItem?.find(
            (y: IMedservice) => x === y.medServiceId
          )?.price,
          subotal: proceduresList?.resultItem?.find(
            (y: IMedservice) => x === y.medServiceId
          )?.price,
          remarks: data_?.remarks,
          entryUserId: userDetails?.USER_ID,
          facilityId: userDetails?.FACILITY_ID,
          appointmentDate: dayjs(appointmentDate).toISOString(),
        };
        if (rebateInfo) {
          item_.rebate = {
            facilityId: userDetails?.FACILITY_ID,
            doctorId: refererId,
            rebatePercent: userDetails?.FACILITY_REBATE_PERCENTAGE,
            refererHospital: data_.refererHospital,
            referer: {
              doctorName: data_.refererName,
              doctorEmail: data_.refererEmail,
              doctorPhone: data_.refererPhone,
              doctorHospital: data_.refererHospital,
              doctorId: refererId,
            },
          };
        }
        proceduresToSubmit.push(item_);
      });
      mutateFn_CreateAppointment(proceduresToSubmit, () => {
        toast.success('Appointment Created Successfully');
        triggerCloseAfterSuccess();
      });
    };

    if (existingPatientId && existingRefererId) {
      // create appointment straight
      createAppointment(existingPatientId, existingRefererId);
    } else if (existingPatientId && !existingRefererId) {
      // create referer first
      if (!proceduresWithRebate.length) {
        createAppointment(existingPatientId, null);
      } else {
        const { refererEmail, refererHospital, refererPhone } = getValues();

        const data = {
          doctorEmail: refererEmail,
          doctorHospital: refererHospital,
          doctorName: refererName,
          doctorPhone: refererPhone,
        };
        mutateFn_CreateReferer(data, (res) => {
          if (res?.data?.doctorId) {
            setExistingRefererId(res?.data?.doctorId);
            createAppointment(existingPatientId, res?.data?.doctorId);
          }
        });
      }
    } else if (
      (!existingPatientId && existingRefererId) ||
      (!existingPatientId && !proceduresWithRebate.length)
    ) {
      // create patient first
      const {
        patientAge,
        patientEmail,
        patientGenderId,
        patientNumber,
        maritalStatusId,
      } = getValues();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        patientName: `${patientName}`,
        patientAge,
        patientEmail,
        patientPhone: patientNumber,
        patientGenderId,
        maritalStatusId,
        takingMedication: JSON.parse(
          (getValues().takingMeds as unknown as string) ?? 'false'
        ),
        patientFacilityCode: userDetails?.FACILITY_ID as string,
        facilityId: userDetails?.FACILITY_ID as string,
        isActive: false,
      };
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      mutateFn_CreatePatient(formData, (res) => {
        if (res.data?.patientUniqueID) {
          setExistingPatientId(res.data.patientUniqueID);
          createAppointment(res.data.patientUniqueID, existingRefererId);
        }
      });
    } else {
      const {
        refererEmail,
        refererHospital,
        refererPhone,
        patientAge,
        patientEmail,
        patientGenderId,
        patientNumber,
        maritalStatusId,
      } = getValues();

      const data = {
        doctorEmail: refererEmail,
        doctorHospital: refererHospital,
        doctorName: refererName,
        doctorPhone: refererPhone,
      };

      mutateFn_CreateReferer(data, (res) => {
        if (res?.data?.doctorId) {
          setExistingRefererId(res?.data?.doctorId);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any = {
            patientName: `${patientName}`,
            patientAge,
            patientEmail,
            patientPhone: patientNumber,
            patientGenderId,
            maritalStatusId,
            takingMedication: JSON.parse(
              (getValues().takingMeds as unknown as string) ?? 'false'
            ),
            patientFacilityCode: userDetails?.FACILITY_ID as string,
            facilityId: userDetails?.FACILITY_ID as string,
            isActive: false,
          };

          const formData = new FormData();

          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
          });

          mutateFn_CreatePatient(formData, (res2) => {
            if (res2.data?.patientUniqueID) {
              setExistingPatientId(res2.data.patientUniqueID);
              createAppointment(res2.data.patientUniqueID, res?.data?.doctorId);
            }
          });
        }
      });
    }
  };

  const triggerCloseAfterSuccess = () => {
    setCreatePromptIsOpen(false);
    onClose();
  };

  const [selectedProcedures, setSelectedProcedures] = useState<number[]>([]);

  // rebates part
  const [proceduresWithRebate, setProceduresWithRebate] = useState<number[]>(
    []
  );

  const handleAddRebateClick = () => {
    if (proceduresWithRebate.length < selectedProcedures.length) {
      setProceduresWithRebate(proceduresWithRebate.concat(0));
    }
  };

  const handleRebateSelectionFromDropdown = (
    event: SelectChangeEvent<number>
  ) => {
    if (proceduresWithRebate.find((x) => x === event.target.value)) {
      // if the an already event.target.value one is event.target.value again
      return;
    }
    setProceduresWithRebate(
      proceduresWithRebate.slice(0, -1).concat(event.target.value as number)
    );
  };

  const deleteRebateForProcedure = (procedureId: number) => {
    setProceduresWithRebate(
      proceduresWithRebate.filter((id) => id !== procedureId)
    );
  };

  useEffect(() => {
    console.log({ selectedProcedures });
  }, [selectedProcedures]);

  //  Discounts and total
  // const { useGetAllDiscountsForFacility } = discountQueries;
  // const { mutateFn: mutateFn_GetDiscountsForFacility, data: allDiscounts } =
  //   useGetAllDiscountsForFacility();
  const facilityDiscounts: any[] = [];
  const procedureDiscounts: any[] = [];

  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  //   mathematics
  useEffect(() => {
    let _subTotal = 0;
    let _total = 0;
    let _totalDiscount = 0;

    const facilityRebate = Number(userDetails!.FACILITY_REBATE_PERCENTAGE);

    for (const procedureId of selectedProcedures) {
      // get the price of the procedureId
      let price = proceduresList?.resultItem?.find(
        (x: IMedservice) => x.medServiceId === procedureId
      )?.price;
      price = Number(price) || 0;

      // check if the procedureId has rebate selected
      // and change the price
      const rebateInfo = proceduresWithRebate?.find((x) => x === procedureId);
      if (rebateInfo) {
        price = price - (facilityRebate / 100) * price;
      }

      // check if there's procedure based discount
      const procedureFoundFromProceduresWithDiscount =
        procedureDiscounts.filter((x) => x.procedureId === procedureId);
      for (const r of procedureFoundFromProceduresWithDiscount) {
        _totalDiscount = _totalDiscount + r.discountPercent * price;
      }

      // subtract all the facility based discounts
      for (const r of facilityDiscounts) {
        _totalDiscount = _totalDiscount + r.discountPercent * price;
      }

      _subTotal = _subTotal + price;
    }

    _total = _subTotal - _totalDiscount;

    setSubTotal(_subTotal);
    setTotal(_total);
    setTotalDiscount(_totalDiscount);
  }, [selectedProcedures, proceduresWithRebate]);

  // remove selected rebate when procedure is unselected
  useEffect(() => {
    for (const rebateId of proceduresWithRebate) {
      if (!selectedProcedures.find((id) => id === rebateId)) {
        setProceduresWithRebate(
          proceduresWithRebate.filter((r) => r !== rebateId)
        );
      }
    }
  }, [selectedProcedures]);

  return (
    <>
      <div className="bg-white px-6 py-10 rounded-tl-[20px] rounded-bl-[20px] right-modal overflow-y-auto">
        {!createPromptIsOpen ? (
          <>
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-2xl">{'New Appointment Request Form'}</h4>
              <button
                onClick={() => {
                  onClose();
                }}
                className="btn-icon"
              >
                <img src={Assets.Icons.BoxCloseIcon} alt="" />
              </button>
            </div>

            <form
              className="grid md:grid-cols-2 gap-5 mt-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* add required */}
              <SearchableInput
                options={patientsFound ?? []}
                label="Patient Name *"
                onInputChange={(newValue) => setPatientName(newValue)}
                inputValue={patientName}
                onOptionSelect={(option) =>
                  handleSelectedPatientFromSearch(option)
                }
                optionLabelKey="patientName"
                error={errors?.patientName}
              />

              <PhoneInputField
                control={control}
                label="Patient Mobile Number *"
                name="patientNumber"
                readonly={!!existingPatientId}
                containerClass="h-[72px]"
                error={errors?.patientNumber}
              />

              <Input
                label="Email Address *"
                placeholder="adepoju@cloud.io"
                readOnly={!!existingPatientId}
                {...register('patientEmail')}
                error={errors?.patientEmail}
              />

              <Controller
                name="patientGenderId"
                control={control}
                // defaultValue={0}
                rules={{ required: 'Gender is required' }}
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

              <Input
                label="Age of the Patient *"
                placeholder="15"
                type="number"
                readOnly={!!existingPatientId}
                {...register('patientAge', {
                  required: 'Patient Age is required ',
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

              <MultiSelectWithCheckbox
                label="Procedures *"
                options={
                  proceduresList?.resultItem?.map((x) => ({
                    id: x.medServiceId.toString(),
                    name: x.medServiceName,
                    price: `₦ ${numeral(x.price).format('0,0.00')}`,
                  })) ?? []
                }
                onSelectionChange={(x) => {
                  setSelectedProcedures(x.map((r) => Number(r)));
                }}
                // error={errors}
              />

              <Controller
                name="patientBloodGroup"
                control={control}
                rules={{ required: 'Blood Group is required' }}
                // defaultValue={0}
                render={({ field }) => (
                  <Select
                    options={[
                      {
                        value: 'A+',
                        label: 'A+',
                        categoryId: 'A+',
                        categoryName: 'A+',
                      },
                      {
                        value: 'A-',
                        label: 'A-',
                        categoryId: 'A-',
                        categoryName: 'A-',
                      },
                      {
                        value: 'B+',
                        label: 'B+',
                        categoryId: 'B+',
                        categoryName: 'B+',
                      },
                      {
                        value: 'B-',
                        label: 'B-',
                        categoryId: 'B-',
                        categoryName: 'B-',
                      },
                      {
                        value: 'O+',
                        label: 'O+',
                        categoryId: 'O+',
                        categoryName: 'O+',
                      },
                      {
                        value: 'O-',
                        label: 'O-',
                        categoryId: 'O-',
                        categoryName: 'O-',
                      },
                      {
                        value: 'AB+',
                        label: 'AB+',
                        categoryId: 'AB+',
                        categoryName: 'AB+',
                      },
                      {
                        value: 'AB-',
                        label: 'AB-',
                        categoryId: 'AB-',
                        categoryName: 'AB-',
                      },
                    ]}
                    label="Patient Blood Group  *"
                    placeholder="Select Blood Group"
                    containerClass="flex-1"
                    error={errors?.patientBloodGroup}
                    {...{ field }}
                  />
                )}
              />

              <Input
                label="Blood Pressure *"
                placeholder="80/120"
                readOnly={!!existingPatientId}
                error={errors?.bloodPressure}
                {...register('bloodPressure', {
                  required: 'Blood Group is required',
                })}
              />

              <Input
                label="Pulse *"
                placeholder="80/120"
                readOnly={!!existingPatientId}
                error={errors?.pulse}
                {...register('pulse', { required: 'Pulse is required' })}
              />

              <div className="md:col-span-2">
                {/* REFACTOR: Move to it's own component */}
                <p>Taking any medications currently? *</p>

                <Controller
                  name="takingMeds"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <RadioGroup defaultValue={false} row {...field}>
                      <FormControlLabel
                        control={
                          <Radio readOnly={!!existingPatientId} value={true} />
                        }
                        label="Yes"
                      />
                      <FormControlLabel
                        control={
                          <Radio readOnly={!!existingPatientId} value={false} />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />
                {!!errors?.takingMeds && (
                  <p className="text-red-500 text-sm">
                    {errors?.takingMeds?.message}
                  </p>
                )}
              </div>

              {/* REFACTOR: This is redundant, the provider already exists in app.tsx*/}
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
              {/* TODO: move to it's own component */}
              <DateTimePicker
                label="Appointment Date and Time"
                value={appointmentDate}
                minDateTime={dayjs()}
                onChange={(newValue) => {
                  setAppointmentDate(newValue);
                }}
              />
              {/* </LocalizationProvider> */}

              {/* Rebates Section */}
              <div className="md:col-span-2 border-b-[2px] pb-1 mt-6 md:mt-10 border-b-solid border-borderLine">
                <h4 className="font-bold text-xl">Referral</h4>
                <p className="text-sm text-greyText2 mt-1">
                  Click the add button to add rebate to various procedures
                </p>
              </div>

              {proceduresWithRebate.map((procedureId, index) => (
                <div
                  key={procedureId}
                  className="md:col-span-2 grid mt-6 md:grid-cols-2 gap-5 md:gap-8"
                >
                  <div className="form-input-label-holder">
                    <label>Procedure for Rebate *</label>
                    <MatSelect
                      value={proceduresWithRebate[index]}
                      onChange={handleRebateSelectionFromDropdown}
                    >
                      {selectedProcedures.map((rxt) => (
                        <MenuItem key={rxt} value={rxt}>
                          <ListItemText>
                            {proceduresList?.resultItem?.find(
                              (x: IMedservice) => x.medServiceId === rxt
                            )?.medServiceName +
                              ` (₦ ${numeral(
                                proceduresList?.resultItem?.find(
                                  (x: IMedservice) => x.medServiceId === rxt
                                )?.price ?? 0
                              ).format('0,0.00')})`}
                          </ListItemText>
                        </MenuItem>
                      ))}
                    </MatSelect>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="form-input-label-holder">
                      <label>Rebate Amount *</label>
                      <input
                        className="ce-input"
                        value={
                          proceduresList?.resultItem?.find(
                            (x: IMedservice) =>
                              x.medServiceId === proceduresWithRebate[index]
                          )?.price
                            ? `₦ ${numeral(
                                (proceduresList?.resultItem?.find(
                                  (x: IMedservice) =>
                                    x.medServiceId ===
                                    proceduresWithRebate[index]
                                )?.price ?? 0) *
                                  (Number(
                                    userDetails!.FACILITY_REBATE_PERCENTAGE
                                  ) /
                                    100)
                              ).format('0,0.00')}`
                            : ''
                        }
                        readOnly
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteRebateForProcedure(procedureId);
                      }}
                    >
                      <img src={Assets.Icons.Delete} alt="" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="md:col-span-2">
                <button
                  onClick={handleAddRebateClick}
                  type="button"
                  className="w-fit mt-4 flex items-center gap-1 cursor-pointer"
                >
                  <img src={Assets.Icons.FilledWhitePlus} alt="plus icon" />{' '}
                  <span className="text-greenText text-sm">
                    Add Rebate to a Procedure
                  </span>
                </button>
              </div>

              {proceduresWithRebate?.length ? (
                <>
                  <SearchableInput
                    options={referersFound ?? []}
                    label="Referer Name"
                    onInputChange={(newValue) => setRefererName(newValue)}
                    inputValue={refererName}
                    onOptionSelect={(option) =>
                      handleSelectedRefererFromSearch(option)
                    }
                    optionLabelKey="doctorName"
                    isDoctor={true}
                  />
                  <Input
                    label="Referer's Hospital/Laboratory"
                    placeholder="Fountain Care"
                    {...register('refererHospital')}
                  />
                  <Input
                    label="Referer Email Address"
                    placeholder="email@example.io"
                    {...register('refererEmail')}
                  />
                  <PhoneInputField
                    control={control}
                    label="Referer Phone Number"
                    name="refererPhone"
                    containerClass="h-[72px]"
                  />{' '}
                </>
              ) : null}

              <TextArea
                label="Remarks"
                placeholder="Leave a message for the diagnostic center"
                {...register('remarks')}
                containerClass="md:col-span-2"
                rows={5}
              />

              <Controller
                name="isPaid"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    className="md:col-span-2"
                    control={<Checkbox defaultChecked={false} {...field} />}
                    label="Pay before running the test?"
                  />
                )}
              />

              <ReportsPriceBreakdown
                subTotal={subTotal}
                discount={totalDiscount}
                total={total}
                containerStyles="mt-4 md:col-span-2"
              ></ReportsPriceBreakdown>

              <Button
                loading={isLoading}
                className="md:w-[270px]"
                disabled={!selectedProcedures.length}
                label="Book an Appointment"
                title={!selectedProcedures.length ? `Select a procedure` : ''}
              />
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            <img src={Assets.Icons.ModalConfirm} alt="confirm icon" />

            <p className="text-center">
              Are you sure you want to book this appointment
            </p>

            {!existingPatientId ? (
              <p className="text-center mt-2">
                Kindly note that you are creating a new patient
              </p>
            ) : (
              <></>
            )}

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="ce-btn-text"
                onClick={() => {
                  setCreatePromptIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ce-btn-outline !border-greenText hover:bg-greenText text-greenText"
                onClick={() => submitData()}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentModal;
