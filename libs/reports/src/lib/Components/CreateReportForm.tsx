import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import numeral from 'numeral';

import {
  Autocomplete,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  Select as MatSelect,
  SelectChangeEvent,
} from '@mui/material';
import {
  IPatient,
  IDiscount,
  IUser,
  IFacility,
  IMedservice,
} from '@cloud-equipment/models';
import { environment } from '@cloud-equipment/environments';
import { axiosInstance } from '@cloud-equipment/api';
import { setLoading, clearLoading } from '@cloud-equipment/shared_store';
import { ReportsPriceBreakdown } from './ReportsPriceBreakdown';
import * as Assets from '@cloud-equipment/assets';
import patientQueries from '../queries/patients';
import facilityQueries from '../queries/facilities';
import medserviceQueries from '../queries/medservices';
import discountQueries from '../queries/discounts';
import refererQueries from '../queries/referers';
import reportQueries from '../queries/reports';
import {
  Input,
  Select,
  PhoneInputField,
  SearchableInput,
  MultiSelectWithCheckbox,
  TextArea,
} from '@cloud-equipment/ui-components';
import { Gender, MaritalStatus } from '../constants';

const CreateReportForm = () => {
  const userDetails = useSelector(
    (state: { auth: { user: IUser } }) => state.auth.user
  );

  const accountType = useSelector(
    (state: { account: { accountType: 0 | 1 } }) => state.account.accountType
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // if its superadmin
  const [selectedFacility, setSelectedFacility] = useState<IFacility | null>(
    null
  );

  const { useGetAllFacilities } = facilityQueries;
  const { mutateFn: mutateFn_GetAllFacilities, data: facilitiesList } =
    useGetAllFacilities();

  useEffect(() => {
    if (accountType === 0) {
      mutateFn_GetAllFacilities({}, () => {});
    }
  }, []);

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm();

  const [patientName, setPatientName] = useState('');
  const [existingPatientId, setExistingPatientId] = useState<string | null>(
    null
  );

  const { useSearchPatientByName, useCreatePatient } = patientQueries;
  const { data: patientsFound } = useSearchPatientByName(
    patientName,
    accountType === 0
      ? (selectedFacility?.id as string)
      : userDetails?.FACILITY_ID
  );
  const { mutateFn: mutateFn_CreatePatient, isLoading: isCreatingPatient } =
    useCreatePatient();

  const [facilityDiscounts, setFacilityDiscounts] = useState<IDiscount[]>([]);
  const [procedureDiscounts, setProcedureDiscounts] = useState<IDiscount[]>([]);

  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const clearPatientFound = () => {
    setValue('patientPhone', '');
    setValue('patientAge', '');
    setValue('patientAddress', '');
    setValue('patientGenderId', '');
    setValue('patientEmail', '');
  };

  const handleSelectedPatientFromSearch = (selectedPatient: IPatient) => {
    setValue('patientId', selectedPatient?.patientUniqueID);
    setValue('patientName', selectedPatient?.patientName);
    setValue('patientPhone', selectedPatient?.patientPhone);
    setValue('patientAge', selectedPatient?.patientAge);
    setValue('patientAddress', selectedPatient?.address);
    setValue('patientGenderId', selectedPatient?.patientGenderId);
    setValue('patientEmail', selectedPatient?.patientEmail);

    setExistingPatientId(selectedPatient?.patientUniqueID);
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

  //   discounts
  const { useGetAllDiscountsForFacility } = discountQueries;
  const { mutateFn: mutateFn_GetDiscountsForFacility, data: allDiscounts } =
    useGetAllDiscountsForFacility(
      accountType === 0
        ? (selectedFacility?.id as string)
        : (userDetails?.FACILITY_ID as string)
    );

  useEffect(() => {
    if (accountType === 1 || (accountType === 0 && selectedFacility?.id)) {
      mutateFn_GetDiscountsForFacility({}, (res) => {
        const facDiscounts = [];
        const proDiscounts = [];

        for (const item of res.data.data) {
          if (item.discountTypeId === 1) {
            facDiscounts.push(item);
          } else {
            proDiscounts.push(item);
          }
        }

        setFacilityDiscounts(facDiscounts);
        setProcedureDiscounts(proDiscounts);
      });
    }
  }, [selectedFacility]);

  // medservices with query
  const { useGetMedservicesForFacility } = medserviceQueries;
  const { data: proceduresList, isLoading } = useGetMedservicesForFacility({
    facilityId: (accountType === 0
      ? selectedFacility?.id ?? ''
      : userDetails?.FACILITY_ID ?? '') as string,
    download: false,
    currentPage: 1,
    startIndex: 0,
    pageSize: 1000,
  });

  const [selectedProcedures, setSelectedProcedures] = useState<number[]>([]);

  //   rebates
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

  const { useCreateReport } = reportQueries;
  const { mutateFn: mutateFn_CreateReport, isLoading: isCreatingReport } =
    useCreateReport();

  const onSubmit = () => {
    const facilityId =
      accountType === 0 ? selectedFacility?.id : userDetails.FACILITY_ID;

    const createReport = (patientId: string, refererId: string | null) => {
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
          facilityId: facilityId,
          appointmentDate: dayjs().toISOString(),
        };
        if (rebateInfo) {
          item_.rebate = {
            facilityId: facilityId,
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
      mutateFn_CreateReport(proceduresToSubmit, () => {
        toast.success('Report Created Successfully');
        dispatch(clearLoading());
        navigate('/reports');
      });
    };

    if (existingPatientId && existingRefererId) {
      // create appointment straight
      createReport(existingPatientId, existingRefererId);
    } else if (existingPatientId && !existingRefererId) {
      // create referer first
      if (!proceduresWithRebate.length) {
        createReport(existingPatientId, null);
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
            createReport(existingPatientId, res?.data?.doctorId);
          }
          setTimeout(() => {
            dispatch(clearLoading());
            navigate('/reports');
          }, 400);
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
        patientFacilityCode: facilityId,
        facilityId: facilityId,
        isActive: false,
      };

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      mutateFn_CreatePatient(formData, (res) => {
        if (res.data?.patientUniqueID) {
          setExistingPatientId(res.data.patientUniqueID);
          createReport(res.data.patientUniqueID, existingRefererId);
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
            patientFacilityCode: facilityId,
            facilityId: facilityId,
            isActive: false,
          };

          const formData = new FormData();

          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
          });

          mutateFn_CreatePatient(formData, (res2) => {
            if (res2.data?.patientUniqueID) {
              setExistingPatientId(res2.data.patientUniqueID);
              createReport(res2.data.patientUniqueID, res?.data?.doctorId);
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    if (isCreatingPatient || isCreatingReferer || isCreatingReport) {
      dispatch(setLoading());
    } else {
      dispatch(clearLoading());
    }
  }, [isCreatingPatient, isCreatingReferer, isCreatingReport]);

  //   mathematics
  useEffect(() => {
    let _subTotal = 0;
    let _total = 0;
    let _totalDiscount = 0;

    let facilityRebate = 0;

    if (
      (accountType === 0 && selectedFacility?.rebatePercent) ||
      (accountType === 1 && userDetails?.FACILITY_REBATE_PERCENTAGE)
    ) {
      facilityRebate =
        accountType === 0
          ? Number(selectedFacility!.rebatePercent)
          : Number(userDetails!.FACILITY_REBATE_PERCENTAGE);
    }

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
  }, [selectedProcedures, proceduresWithRebate, selectedFacility]);

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
    <section className=" p-5 md:p-10 xl:px-20 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="[box-shadow:_0px_4px_40px_0px_#0D95891A] bg-white rounded-2xl p-5 md:p-8 mx-auto md:w-[80%] 2xl:max-w-[1100px]"
      >
        {accountType === 0 ? (
          <div className="form-input-label-holder mb-5">
            <label>Select Facility</label>
            <Select
              name="Facility"
              value={selectedFacility ?? ''}
              onChange={(event: any) => {
                setSelectedFacility(event.target.value);
              }}
              renderValue={(selected: any) => {
                return selected.facilityName;
              }}
            >
              {facilitiesList?.map((facility: IFacility) => (
                <MenuItem key={facility.id} value={facility as unknown as any}>
                  <ListItemText>{facility.facilityName}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </div>
        ) : (
          <></>
        )}

        <div className="border-b-[2px] pb-1 border-b-solid border-borderLine">
          <h4 className="font-bold text-xl">Patient Details</h4>
          <p className="text-sm text-greyText2 mt-1">
            You are about to fill in the patient basic information
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-10">
          <SearchableInput
            options={patientsFound ?? []}
            label="Patient Name"
            onInputChange={(newValue) => setPatientName(newValue)}
            inputValue={patientName}
            onOptionSelect={(option) => handleSelectedPatientFromSearch(option)}
            optionLabelKey="patientName"
          />

          <PhoneInputField
            control={control}
            label="Patient Mobile Number"
            name="patientPhone"
            containerClass="h-[70px]"
          />

          <Controller
            name="patientGenderId"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <Select
                options={Gender}
                label="Gender"
                placeholder="Select Gender"
                containerClass="flex-1"
                {...{ field }}
              />
            )}
          />

          <Input
            label="Age of the Patient"
            {...register('patientAge', { required: 'Patient age is required' })}
            type="number"
          />

          <Input
            label="Patient Email"
            placeholder="patient@cloudequipment.io"
            {...register('patientEmail', {
              required: 'Patient email is required',
            })}
            type="email"
          />

          <Input
            label="Patient Address"
            placeholder="No 24, W. F. Kumuyi Street,"
            {...register('patientAddress', {
              required: 'Patient address is required',
            })}
          />

          <MultiSelectWithCheckbox
            label="Procedures"
            options={
              proceduresList?.resultItem?.map((x: any) => ({
                id: x.medServiceId.toString(),
                name: x.medServiceName,
                price: `₦ ${numeral(x.price).format('0,0.00')}`,
              })) ?? []
            }
            onSelectionChange={(x) => {
              setSelectedProcedures(x.map((r) => Number(r)));
            }}
          />

          <Controller
            name="maritalStatusId"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <Select
                options={MaritalStatus}
                label="Marital Status"
                placeholder="Select Marital Status"
                {...{ field }}
              />
            )}
          />
        </div>

        <div className="border-b-[2px] pb-1 mt-6 md:mt-10 border-b-solid border-borderLine">
          <h4 className="font-bold text-xl">Rebate</h4>
          <p className="text-sm text-greyText2 mt-1">
            Click the add button to add rebate to various procedures
          </p>
        </div>

        {proceduresWithRebate.map((procedureId, index) => (
          <div
            key={procedureId}
            className=" grid mt-6 md:grid-cols-2 gap-5 md:gap-8"
          >
            <div className="form-input-label-holder">
              <label>Procedure for Rebate</label>
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
                <label>Rebate Amount</label>
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
                              x.medServiceId === proceduresWithRebate[index]
                          )?.price ?? 0) *
                            (Number(userDetails!.FACILITY_REBATE_PERCENTAGE) /
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

        <button
          onClick={handleAddRebateClick}
          type="button"
          className="mt-4 flex items-center gap-1 cursor-pointer"
        >
          <img src={Assets.Icons.FilledWhitePlus} alt="plus icon" />{' '}
          <span className="text-greenText text-sm">
            Add Rebate to a Procedure
          </span>
        </button>

        <div className="border-b-[2px] pb-1 mt-6 md:mt-10 border-b-solid border-borderLine">
          <h4 className="font-bold text-xl">Deduction</h4>
          <p className="text-sm text-greyText2 mt-1">
            You are to populate the Rebate Amount to efficiency calculate a
            deduction
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-10">
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
        </div>

        <ReportsPriceBreakdown
          subTotal={subTotal}
          discount={totalDiscount}
          total={total}
          containerStyles="mt-10"
        ></ReportsPriceBreakdown>

        <button className="p-3 lg:px-6 ce-btn bg-greenText block w-[80%] mx-auto mt-10 max-w-[500px]">
          Save
        </button>
      </form>
    </section>
  );
};

export default CreateReportForm;
