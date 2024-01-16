import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { environment } from '@cloud-equipment/environments';
import api from '@cloud-equipment/api';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { Checkbox, ListItemText } from '@mui/material';
import {
  IMedService,
  IMedserviceCategory,
  ApiResponse,
  IPatient,
  IDiscount,
  IUser,
} from '@cloud-equipment/models';
import { setLoading, clearLoading } from '@cloud-equipment/shared_store';
import { ReportsPriceBreakdown } from './ReportsPriceBreakdown';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';
import * as Assets from '@cloud-equipment/assets';
import { useNavigate } from 'react-router-dom';

const CreateReportForm = () => {
  const userDetails = useSelector(
    (state: { auth: { user: IUser } }) => state.auth.user
  );

  const { register, handleSubmit, watch, setValue, control } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patientId = watch('patientId');

  const [isNewPatient, setIsNewPatient] = useState(true); // whether the patient was fetched

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [patientsFound, setPatientsFound] = useState<Array<IPatient>>([]);

  const [facilityDiscounts, setFacilityDiscounts] = useState<IDiscount[]>([]);
  const [procedureDiscounts, setProcedureDiscounts] = useState<IDiscount[]>([]);

  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const searchPatientsByName = async (searchTerm: string) => {
    if (!searchTerm) return;
    const url = `${environment.baseUrl}/patient/getpatientbyname`;
    try {
      const response = await api.get(url, {
        params: { patientName: searchTerm },
      });

      if (response.data.success) {
        setPatientsFound(response.data.data);
      }
    } catch (error) {
      setPatientsFound([]);
    }
  };

  const FetchPatient = async () => {
    // 1404174
    const url = `${environment.baseUrl}/patient/getpatientbyuniqueid/${patientId}`;

    return api
      .get(url)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setIsNewPatient(false);
          setSelectedPatient(res.data.data);
          setValue('patientPhone', res.data.data?.patientPhone);
          setValue('patientAge', res.data.data?.patientAge);
          setValue('patientAddress', res.data.data?.patientAddress);
          setValue('patientGenderId', res.data.data?.patientGenderId);
          setValue('patientEmail', res.data.data?.patientEmail);
        } else {
          setIsNewPatient(true);
        }
      })
      .catch((err) => {
        setIsNewPatient(true);
      });
  };

  useEffect(() => {
    if (patientId) {
      FetchPatient();
    }
  }, [patientId]);

  const handleSelect = (selectedPatient: IPatient) => {
    setIsNewPatient(false);
    setValue('patientId', selectedPatient?.patientUniqueID);
    setValue('patientName', selectedPatient?.patientName);
    setValue('patientPhone', selectedPatient?.patientPhone);
    setValue('patientAge', selectedPatient?.patientAge);
    setValue('patientAddress', selectedPatient?.address);
    setValue('patientGenderId', selectedPatient?.patientGenderId);
    setValue('patientEmail', selectedPatient?.patientEmail);
  };

  //   discounts
  const fetchAllDiscounts = () => {
    const url = `${environment.baseUrl}/payment/discounts/getactivediscount/facilityId`;

    api
      .get(url, { params: { facilityId: userDetails?.FACILITY_ID } })
      .then((res: AxiosResponse<ApiResponse<IDiscount[]>>) => {
        if (res.data.success) {
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
        }
      });
  };

  // multiselect guys with their handlers
  const [categoriesList, setCategoriesList] = useState<IMedserviceCategory[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const renderSelectedCategories = (selected: number[]) => {
    let ans = '';
    selected.forEach((x, index) => {
      ans =
        ans +
        (index ? ', ' : '') +
        categoriesList.find((r) => r.categoryId === x)?.categoryName;
    });
    return ans;
  };

  const renderSelectedProcedures = (selected: number[]) => {
    let ans = '';
    selected.forEach((x, index) => {
      ans =
        ans +
        (index ? ', ' : '') +
        proceduresList.find((r) => r.medServiceId === x)?.medServiceName;
    });
    return ans;
  };

  const [proceduresList, setProceduresList] = useState<IMedService[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState<number[]>([]);

  const handleChange_categories = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(value as number[]);
  };

  const handleChange_procedures = (
    event: SelectChangeEvent<typeof selectedProcedures>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedProcedures(value as number[]);
  };

  const FetchProedure = () => {
    const url = `${environment.baseUrl}/service-manager/medServices/getall`;
    api
      .get(url)
      .then((res: AxiosResponse) => {
        setProceduresList(res.data.data);
      })
      .catch((err) => {});
  };

  const FetchCategory = () => {
    const url = `${environment.baseUrl}/service-manager/medServiceCategory/getactivemedservicecategory`;
    api
      .get(url)
      .then((res: AxiosResponse) => {
        setCategoriesList(res.data.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    FetchProedure();
    FetchCategory();
    fetchAllDiscounts();
  }, []);

  //   rebates
  const [proceduresListForRebate, setProceduresListForRebate] = useState<
    number[]
  >([]);

  const [proceduresWithRebate, setProceduresWithRebate] = useState<number[]>(
    []
  );

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
    // after selecting an event.target.value for rebate, remove it from the list
    setProceduresListForRebate(
      proceduresListForRebate.filter((x) => x !== event.target.value)
    );
  };

  const handleAddRebateClick = () => {
    if (proceduresListForRebate.length) {
      setProceduresWithRebate(proceduresWithRebate.concat(0));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data_: any) => {
    const createProcedure = (patientId: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const proceduresToSubmit: any[] = [];
      selectedProcedures.forEach((x) => {
        const rebateInfo = proceduresWithRebate.find((y) => y === x);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item_: any = {
          patientId: patientId,
          medServiceId: x,
          quantity: 1,
          amount: proceduresList.find((y) => x === y.medServiceId)?.price,
          subotal: proceduresList.find((y) => x === y.medServiceId)?.price,
          remarks: data_?.remarks,
          entryUserId: userDetails?.USER_ID,
          facilityId: userDetails?.FACILITY_ID,
          procedureDiscountId: 0,
          faclityDiscountId: 0,
        };
        if (rebateInfo) {
          item_.rebate = {
            facilityId: userDetails?.FACILITY_ID,
            rebatePercent: 5,
            refererHospital: userDetails?.FACILITY_ID,
            refererName: data_.refererName,
            refererEmail: data_.refererEmail,
            refererPhone: data_.refererPhone,
          };
        }
        proceduresToSubmit.push(item_);
      });
      dispatch(setLoading());

      api
        .post(
          `${environment.baseUrl}/service-manager/procedures/create`,
          proceduresToSubmit
        )
        .then((response) => {
          navigate('/reports');
        })
        .catch((err) => {})
        .finally(() => dispatch(clearLoading()));
    };

    if (isNewPatient) {
      const data = {
        patientFacilityCode: userDetails?.FACILITY_ID,
        patientName: data_.patientName,
        patientAge: Number(data_.patientAge) || 10,
        patientEmail: data_.patientEmail,
        patientPhone: data_.patientPhone,
        patientGenderId: 0,
        aboutPatient: '',
        maritalStatusId: 0,
        address: data_.patientAddress,
        dateOfBirth: '2024-01-03T08:37:00.151Z',
      };
      dispatch(setLoading());
      api
        .post(`${environment.baseUrl}/patient/createpatient`, data)
        .then((response) => {
          if (response) {
            createProcedure(response.data.data.patientUniqueID);
            setIsNewPatient(false);
          }
        })
        .catch((err) => {})
        .finally(() => dispatch(clearLoading()));
    } else {
      createProcedure(data_.patientId);
    }
  };

  //   mathematics
  useEffect(() => {
    let _subTotal = 0;
    let _total = 0;
    let _totalDiscount = 0;

    for (const procedureId of selectedProcedures) {
      // get the price of the procedureId
      let price = proceduresList.find(
        (x) => x.medServiceId === procedureId
      )?.price;
      price = Number(price) || 0;

      // check if the procedureId has rebate selected
      // and change the price
      const rebateInfo = proceduresWithRebate?.find((x) => x === procedureId);
      if (rebateInfo) {
        price = price - Number(userDetails!.FACILITY_REBATE_PERCENTAGE) * price;
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

  // populate the dropdown for rebates selection based on the selected procedures
  useEffect(() => {
    setProceduresListForRebate(
      selectedProcedures.filter(
        (x) => !proceduresWithRebate.some((y) => y === x)
      )
    );
  }, [selectedProcedures, proceduresWithRebate]);

  //   remove from the selected procedures with rebates if they are unselected from the procedures list
  useEffect(() => {
    setProceduresWithRebate(
      proceduresWithRebate.filter((x) =>
        selectedProcedures.some((y) => y === x)
      )
    );
  }, [selectedProcedures]);

  // const renderValueForSelectedRebate = (selected: number) => {
  //   return proceduresList.find((x) => x.medServiceId === selected)
  //     ?.medServiceName;
  // };

  return (
    <section className=" p-5 md:p-10 xl:px-20 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="[box-shadow:_0px_4px_40px_0px_#0D95891A] bg-white rounded-2xl p-5 md:p-8 max-w-[1000px] mx-auto"
      >
        <div className="border-b-[2px] pb-1 border-b-solid border-borderLine">
          <h4 className="font-bold text-xl">Patient Details</h4>
          <p className="text-sm text-greyText2 mt-1">
            You are about to fill in the patient basic information
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-10">
          {/* <SearchBox onSelect={handleSelect} /> */}
          {/* <div className="hidden md:block"></div> */}

          <div className="form-input-label-holder">
            <label>Patient Name</label>
            <Autocomplete
              freeSolo
              options={patientsFound}
              onInputChange={(event, newInputValue) => {
                searchPatientsByName(newInputValue);
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
              getOptionLabel={(option) => {
                return (option as IPatient).patientName;
              }}
              renderOption={(props, option) => (
                <MenuItem {...props}>
                  <div className="rounded flex items-center space-x-5 px-3 py-2">
                    <img
                      src={Assets.Icons.DummyUser}
                      className="w-10 rounded-[10px]"
                      alt=""
                    />

                    <div>
                      <p className="font-semibold text-sm">
                        {option.patientName}
                      </p>
                      <p className="text-xs mt-2">
                        {option.patientFacilityCode.substr(0, 5)} .{' '}
                        {option.patientAge} Years
                      </p>
                    </div>
                  </div>
                </MenuItem>
              )}
            />
          </div>

          <div className="form-input-label-holder">
            <label>Patient ID</label>
            <input
              {...register('patientId')}
              name="patientId"
              placeholder="AGA/453"
              className="ce-input"
            />
          </div>

          <div className="form-input-label-holder">
            <label>Patient Mobile Number</label>
            <input
              {...register('patientPhone')}
              className="ce-input"
              placeholder="+234 08143626356"
            />
          </div>

          <div className="form-input-label-holder">
            <label>Gender</label>
            <Controller
              name="patientGender"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value={0} disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value={1}>Male</MenuItem>
                  <MenuItem value={2}>Female</MenuItem>
                </Select>
              )}
            />
          </div>

          <div className="form-input-label-holder">
            <label>Age of the Patient</label>
            <input {...register('patientAge')} className="ce-input" />
          </div>

          <div className="form-input-label-holder">
            <label>Patient Email</label>
            <input
              type="email"
              className="ce-input"
              placeholder="patient@cloudequipment.io"
              {...register('patientEmail')}
            />
          </div>

          <div className="form-input-label-holder">
            <label>Address</label>
            <input
              className="ce-input"
              {...register('patientAddress')}
              placeholder="No 24, W. F. Kumuyi Street,"
            />
          </div>

          <div className="form-input-label-holder">
            <label>Procedure category</label>
            <Select
              multiple
              name="Procedure category"
              value={selectedCategories}
              onChange={(val) => handleChange_categories(val)}
              renderValue={renderSelectedCategories}
            >
              {categoriesList.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  <Checkbox
                    checked={
                      selectedCategories.findIndex((x) => {
                        return x === cat.categoryId;
                      }) > -1
                    }
                  />
                  <ListItemText>{cat.categoryName}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="form-input-label-holder">
            <label>Procedures</label>
            <Select
              multiple
              name="Procedures"
              value={selectedProcedures}
              onChange={(val) => handleChange_procedures(val)}
              renderValue={renderSelectedProcedures}
            >
              {proceduresList.map((medservice) => (
                <MenuItem
                  key={medservice.medServiceId}
                  value={medservice.medServiceId}
                >
                  <Checkbox
                    checked={
                      selectedProcedures.findIndex((x) => {
                        return x === medservice.medServiceId;
                      }) > -1
                    }
                  />
                  <ListItemText>{medservice.medServiceName}</ListItemText>
                  <span>₦{medservice.price}</span>
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="border-b-[2px] pb-1 mt-6 md:mt-10 border-b-solid border-borderLine">
          <h4 className="font-bold text-xl">Rebate</h4>
          <p className="text-sm text-greyText2 mt-1">
            Click the add button to add rebate to various procedure
          </p>
        </div>

        {proceduresWithRebate.map((procedureId, index) => (
          <div
            key={procedureId}
            className="grid mt-6 md:grid-cols-2 gap-5 md:gap-8"
          >
            <div className="form-input-label-holder">
              <label>Procedure for Rebate</label>
              <Select
                value={proceduresWithRebate[index]}
                onChange={handleRebateSelectionFromDropdown}
              >
                {proceduresListForRebate.map((rxt) => (
                  <MenuItem key={rxt} value={rxt}>
                    <ListItemText>
                      {
                        proceduresList.find((x) => x.medServiceId === rxt)
                          ?.medServiceName
                      }
                    </ListItemText>
                    <span>
                      ₦
                      {
                        proceduresList.find((x) => x.medServiceId === rxt)
                          ?.price
                      }
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="form-input-label-holder">
              <label>Rebate Amount</label>
              <input
                className="ce-input"
                value={
                  (proceduresList.find(
                    (x) => x.medServiceId === proceduresWithRebate[index]
                  )?.price ?? 0) *
                  Number(userDetails!.FACILITY_REBATE_PERCENTAGE)
                }
                readOnly
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleAddRebateClick}
          type="button"
          className="mt-4 flex items-center gap-1 cursor-pointer"
        >
          <img src={Assets.Icons.FilledWhitePlus} />{' '}
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
          <div className="form-input-label-holder">
            <label>Referer Name</label>
            <input
              className="ce-input"
              {...register('refererName')}
              placeholder="Adepoju Deborah"
            />
          </div>
          <div className="form-input-label-holder">
            <label>refererName</label>
            <input
              className="ce-input"
              //   {...register("refererName")}
              placeholder="Adepoju Deborah "
            />
          </div>
          <div className="form-input-label-holder">
            <label>Referer's Hospital/Laboratory</label>
            <input
              className="ce-input"
              {...register('refererHospital')}
              placeholder="Fountain Care "
            />
          </div>
          <div className="form-input-label-holder">
            <label>Referer Email Address</label>
            <input
              className="ce-input"
              {...register('refererEmail')}
              placeholder="email@example.io"
            />
          </div>
          <div className="form-input-label-holder">
            <label>Referer Phone</label>
            <input
              className="ce-input"
              {...register('refererPhone')}
              placeholder="+234 90292929 "
            />
          </div>
          <div className="form-input-label-holder md:col-span-2">
            <label>Remarks</label>
            <textarea
              className="ce-input"
              rows={5}
              {...register('remarks')}
              placeholder="Leave a message for the diagnostic center"
            ></textarea>
          </div>
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