import React, { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import {
  _createPrice,
  _getAllFacilities,
  _getMedserviceCategories,
} from '../../../../services/procedures.service';
import {
  ICreateProcedure,
  IMedservice,
  IMedserviceCategory,
  IUser,
} from '@cloud-equipment/models';
import { clearLoading, setLoading } from '@cloud-equipment/shared_store';
import * as Assets from '@cloud-equipment/assets';
import {
  Button,
  Input,
  PhoneInputField,
  Select,
  DatePicker,
} from '@cloud-equipment/ui-components';

interface FormProps {
  medServiceCategoryId: number;
  medServiceName: string;
  price: number;
}

const NewProcedureModal = ({
  onClose,
  procedureToEdit,
}: {
  onClose: () => void;
  procedureToEdit: IMedservice | null;
}) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormProps>();
  const dispatch = useDispatch();
  const [view, setView] = useState<'form' | 'confirm'>('form');

  const userDetails = useSelector(
    (state: { auth: { user: IUser } }) => state.auth.user
  );
  const [categoriesList, setCategoriesList] = useState<IMedserviceCategory[]>(
    []
  );
  const [facilitiesList, setFacilitiesList] = useState<
    { id: string; facilityName: string }[]
  >([]);

  const onSubmit = () => {
    setView('confirm');
  };

  const submitData = () => {
    dispatch(setLoading());

    const payload = { ...(getValues() as ICreateProcedure) };
    payload.facilityId = userDetails?.FACILITY_ID;

    _createPrice(payload)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          onClose();
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        dispatch(clearLoading());
      });
  };

  //REFACTOR: All API services should use react-query
  const getAllCategories = () => {
    _getMedserviceCategories()
      .then((res: any) => {
        if (res.data.success) {
          setCategoriesList(res.data.data);
        }
      })
      .catch(() => {});
  };

  // console.log('categoriesList', categoriesList);
  useEffect(() => {
    getAllCategories();

    if (procedureToEdit) {
      setValue('medServiceCategoryId', procedureToEdit.medServiceCategoryId);
      setValue('medServiceName', procedureToEdit.medServiceName);
      setValue('price', procedureToEdit.price);
    }
  }, []);
  return (
    <div className="bg-white p-10 lg:p-14 centered-modal">
      {view === 'form' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <h4>Add New Price/Procedure</h4>

          <Controller
            name="medServiceCategoryId"
            control={control}
            // defaultValue={0}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select
                options={categoriesList.map((x, i) => ({
                  ...x,
                  value: x.categoryId,
                  label: x.categoryName,
                }))}
                label="Medservice Category *"
                placeholder="Choose Category"
                containerClass="flex-1"
                error={errors?.medServiceCategoryId}
                {...{ field }}
              />
            )}
          />

          <Input
            label="Medservice Name *"
            placeholder="Enter Test / Diagnostic"
            {...register('medServiceName', {
              required: 'Med Service Name is required ',
            })}
            error={errors?.medServiceName}
          />

          <Input
            label="Test/Diagnostic Price *"
            placeholder="Enter Test / Diagnostic"
            {...register('price', {
              required: 'Price is required ',
            })}
            error={errors?.price}
          />

          <button className="ce-btn !bg-greenText mt-3 py-3">
            {procedureToEdit ? 'Update Procedure' : 'Add Price/ Procedure '}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <img src={Assets.Icons.ModalConfirm} alt="confirm icon" />

          <p className="text-center">
            Are you sure you want to {procedureToEdit ? 'update' : 'add '} this
            Procedure/Price
          </p>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="ce-btn-text"
              onClick={() => {
                setView('form');
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
  );
};

export default NewProcedureModal;
