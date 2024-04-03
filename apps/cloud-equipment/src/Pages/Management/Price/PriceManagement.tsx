import React, { useEffect, useState } from 'react';

import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TablePagination,
} from '@mui/material';
import { IMedservice, IProcedureCategory } from '@cloud-equipment/models';
import { _getPrices } from '../../../services/procedures.service';
import * as Assets from '@cloud-equipment/assets';
import medserviceQueries from '../../../services/queries/medservices';
import { NavTab, Table } from '@cloud-equipment/ui-components';
import NewProcedureModal from './modals/NewProcedureModal';
import DeleteProdecureModal from './modals/DeleteProdecureModal';
import ApprovePriceModal from './modals/ApprovePriceModal';
import { createColumnHelper } from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../Store/store';
import { formatDate } from '@cloud-equipment/utils';

type TableColumns = { [key: string]: string };

const columnHelper = createColumnHelper<TableColumns>();

const columns = (
  ProcedureMapping: () => {
    [key: string]: IProcedureCategory;
  }
) => [
  columnHelper.accessor('dateCreated', {
    header: 'Date & Time Added',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('medServiceName', {
    header: 'Procedure Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('medServiceCategoryId', {
    header: 'Procedure Category',
    cell: (info) => {
      const category = ProcedureMapping();
      return category[info.getValue()]?.categoryName;
    },
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
];

const PriceManagement = () => {
  const userDetails = useSelector((state: IAppState) => state.auth.user);

  // table
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const { useGetMedservicesForFacility, useGetMedServicesProcedureCategories } =
    medserviceQueries;
  const { data: paginatedResponse, isLoading } = useGetMedservicesForFacility({
    facilityId: userDetails?.FACILITY_ID as string,
    download: false,
    currentPage,
    startIndex: 0,
    pageSize,
  });
  const {
    data: procedureCategoriesData,
    isLoading: procedureCategoriesLoading,
  } = useGetMedServicesProcedureCategories(
    '/service-manager/medServiceCategory/getallcategory'
  );

  const ProcedureMapping = () => {
    const procedureMapping: { [key: string]: IProcedureCategory } = {};
    if (procedureCategoriesData) {
      (procedureCategoriesData ?? []).forEach((data) => {
        procedureMapping[`${data?.categoryId}`] = data;
      });
    }
    return procedureMapping;
  };
  //   menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedProcedure, setSelectedProcedure] =
    useState<null | IMedservice>(null);

  //   modals
  const [priceModalOpen, setPriceMOdalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteMOdalOpen] = React.useState(false);
  const [approveModalOpen, setApproveMOdalOpen] = React.useState(false);

  //   table
  const handleChangePage = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setCurrentPage(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  //   menu
  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    x: IMedservice
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProcedure(x);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setApproveMOdalOpen(true);
    setPriceMOdalOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteMOdalOpen(true);
  };

  const handleApproveClick = () => {
    handleMenuClose();
    setApproveMOdalOpen(true);
  };

  //   modals
  const openPriceModal = () => {
    setSelectedProcedure(null);
    setPriceMOdalOpen(true);
  };

  const closePriceModal = () => setPriceMOdalOpen(false);
  const closeDeleteModal = () => setDeleteMOdalOpen(false);
  const closeApproveModal = () => setApproveMOdalOpen(false);

  return (
    <>
      <Modal open={priceModalOpen} onClose={closePriceModal}>
        <div>
          {
            <NewProcedureModal
              procedureToEdit={selectedProcedure}
              onClose={closePriceModal}
            />
          }
        </div>
      </Modal>

      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <div>
          {
            <DeleteProdecureModal
              procedureToEdit={selectedProcedure!}
              onClose={closeDeleteModal}
            />
          }
        </div>
      </Modal>

      <Modal open={approveModalOpen}>
        <div>
          {
            <ApprovePriceModal
              procedureData={selectedProcedure!}
              onClose={closeApproveModal}
            />
          }
        </div>
      </Modal>

      <section className="ce-px ce-py">
        <div className="flex justify-end gap-4 flex-wrap mt-5">
          <button onClick={openPriceModal} className="ce-btn">
            New Price/ Test
          </button>
        </div>

        <div className="p-[16px] bg-[white] mt-[20px] rounded-[20px]">
          <div className="grid  gap-5 grid-cols-[1fr_1fr] lg:flex items-center lg:justify-between">
            <div className="col-span-2 lg:col-span-[unset] lg:w-[50%] search-input-container">
              <input placeholder="Search for Procedure" />
              <img src={Assets.Icons.Search} alt="Search Icon" />
            </div>

            <div className="sort-container">
              <span className="sort-text">Sort by:</span>

              <span className="sort-value">Newest to Oldest</span>

              <img src={Assets.Icons.SolidArrowDown} alt="" />
            </div>

            <button className="export-btn">
              <img src={Assets.Icons.ExportIcon} alt="" />
              <span>Export</span>
            </button>
          </div>

          {/* <NavTab
            links={[
              { label: 'All Prices', href: '/management/medservices' },
              { label: 'Approved Prices', href: '.' },
              { label: 'Pending Prices', href: '.' },
            ]}
            wrapperClass="mt-6"
          /> */}

          <Table
            loading={isLoading}
            data={paginatedResponse?.resultItem ?? []}
            columns={columns(ProcedureMapping)}
            tableHeading="All Procedures"
          />
        </div>
      </section>
    </>
  );
};

export default PriceManagement;

const TableMenuDropdown = ({
  cb,
  patientData,
}: {
  cb: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // patientData: IPatient;
  patientData: any;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const navigate = useNavigate();

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    cb(event);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const viewPatient = () => {
    // navigate(`/management/patients/view/${patientData.patientUniqueID}`);
  };

  return (
    <div>
      <button
        onClick={(e) => {
          handleActionClick(e);
        }}
        className="w-6"
      >
        <img src={Assets.Icons.Menudots} alt="" />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            viewPatient();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <img src={Assets.Icons.EditPrice} alt="" />
          </ListItemIcon>
          <ListItemText>View Patient</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
