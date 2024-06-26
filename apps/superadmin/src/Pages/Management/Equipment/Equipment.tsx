import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TablePagination,
} from '@mui/material';

import { createColumnHelper } from '@tanstack/react-table';

import * as Assets from '@cloud-equipment/assets';
import { Button } from '@cloud-equipment/ui-components';
import { Routes } from '../../../routes';
import { Table } from '../../../components';
import queries from '../../../services/queries/manageFacility';
import { IEquipment } from '../../../services/queries/manageEquipment/types';

type FacilityTableColumns = Pick<
  IEquipment,
  | 'id'
  | 'facilityName'
  | 'email'
  | 'facilityAddress'
  | 'phoneNumber'
  | 'lastLogin'
> & { elipsis: 'elipsis' };

const columnHelper = createColumnHelper<FacilityTableColumns>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Facility ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('facilityName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('facilityAddress', {
    header: 'Facility Address',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: 'Phone Number',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last Login',
    cell: (info) => info.getValue(),
  }),
  //   columnHelper.accessor('elipsis', {
  //     cell: ({ row }) => {
  //       const cb = (e: React.MouseEvent<HTMLButtonElement>) => {
  //         console.log('e', e);
  //       };
  //       return <DropDown {...{ cb }} />;
  //     },
  //     header: '',
  //   }),
];

const Equipment = () => {
  const navigate = useNavigate();

  const data = null;

  return (
    <>
      <section className="ce-px ce-py">
        <div className="p-[16px] mt-[20px] rounded-[20px]">
          <h4 className="ce-heading-2">Management &gt; Facilites </h4>

          <div className="grid mt-6 gap-5 grid-cols-[1fr_1fr] lg:flex items-center lg:justify-between">
            <div className="col-span-2 lg:col-span-[unset] lg:w-[30%] search-input-container">
              <input
                placeholder="Enter Email Address/Customer ID"
                className="border"
              />
              <img src={Assets.Icons.Search} alt="Search Icon" />
            </div>

            <div className="sort-container border">
              <span className="sort-text">Users From:</span>

              <span className="sort-value">Facilities</span>

              <img src={Assets.Icons.SolidArrowDown} alt="" />
            </div>
            <div className="sort-container border">
              <span className="sort-text">Date:</span>

              <span className="sort-value">This Month</span>

              <img src={Assets.Icons.SolidArrowDown} alt="" />
            </div>

            <button className="filter-btn">
              <img src={Assets.Icons.ExportIcon} alt="" />
              <span>Filters</span>
            </button>
            <Button
              className="!bg-primary-100 !rounded-md"
              onClick={() =>
                navigate(`/management${Routes.management.addFacility}`)
              }
              label="Add Facilities"
            />
          </div>

          <Table
            // loading={isLoading}
            data={data}
            columns={columns}
            tableHeading="Facilities - 5"
            tableHeadingColorClassName="!bg-secondary-150"
          />
        </div>
      </section>
    </>
  );
};

export default Equipment;
