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
import { Table } from '@cloud-equipment/ui-components';
import NewProcedureModal from './modals/NewProcedureModal';
import DeleteProdecureModal from './modals/DeleteProdecureModal';
import ApprovePriceModal from './modals/ApprovePriceModal';
import { createColumnHelper } from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../Store/store';
import { formatDate } from '@cloud-equipment/utils';
import { useFilters } from '@cloud-equipment/hooks';
import { environment } from '@cloud-equipment/environments';

export type ActionType = null | 'edit' | 'shareResult';
type ModalTypes =
  | 'priceModal'
  | 'editPriceModal'
  | 'deleteModal'
  | 'confirmModal'
  | null;

type TableColumns = { [key: string]: string };

const columnHelper = createColumnHelper<TableColumns>();

const columns = (
  ProcedureMapping: () => {
    [key: string]: IProcedureCategory;
  },
  openModalFn: (view: ModalTypes, selectedProcedure: IMedservice) => void,
  closeModalFn: () => void
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
  columnHelper.accessor('elipsis', {
    cell: ({
      row: {
        original: { ...rest },
      },
    }) => {
      // REFACTOR: is this necessary
      const cb = (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log('e', e);
      };
      return (
        <ReportsListDropdown
          {...{
            cb,
            data: { ...rest },
            openModalFn,
            closeModalFn,
          }}
        />
      );
    },
    header: '',
  }),
];

const PriceManagement = () => {
  const userDetails = useSelector((state: IAppState) => state.auth.user);

  const { useGetMedservicesForFacility, useGetMedServicesProcedureCategories } =
    medserviceQueries;

  const {
    url,
    filters: { currentPage, pageSize },
    setFilters,
  } = useFilters(
    environment.baseUrl,
    '/service-manager/medServices/getallbyfacilitypaged'
  );

  const { data: paginatedResponse, isLoading } = useGetMedservicesForFacility(
    `${url.href}&facilityId=${userDetails?.FACILITY_ID}&currentPage=${currentPage}&startIndex=1&pageSize=${pageSize}`,
    {
      facilityId: userDetails?.FACILITY_ID as string,
      download: false,
      currentPage,
      startIndex: 0,
      pageSize,
    }
  );

  const {
    data: procedureCategoriesData,
    isLoading: procedureCategoriesLoading,
  } = useGetMedServicesProcedureCategories(
    '/service-manager/medServiceCategory/getallcategory'
  );

  // pagination logic
  const total = paginatedResponse?.totalCount || 0;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setFilters((prev: Params) => ({ ...prev, currentPage: page + 1 }));
  };
  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters((prev: Params) => ({
      ...prev,
      pageSize: Number(e.target.value),
    }));
  };
  // pagination logic ends here

  /**
   * @description - this helps us map the category code to an actual value
   * @returns
   */
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
  const [selectedProcedure, setSelectedProcedure] =
    useState<null | IMedservice>(null);

  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const openModalFn = (
    view: ModalTypes = null,
    selectedProcedure: null | IMedservice = null
  ) => {
    setSelectedProcedure(selectedProcedure);
    setOpenModal(view);
  };

  const closeModal = () => {
    setOpenModal(null);
    setSelectedProcedure(null);
  };

  return (
    <>
      <Modal
        open={['editPriceModal', 'priceModal'].includes(openModal ?? '')}
        onClose={closeModal}
      >
        <div>
          {
            <NewProcedureModal
              procedureToEdit={selectedProcedure}
              onClose={closeModal}
            />
          }
        </div>
      </Modal>

      <Modal open={openModal === 'deleteModal'} onClose={closeModal}>
        <div>
          {
            <DeleteProdecureModal
              procedureToEdit={selectedProcedure!}
              onClose={closeModal}
            />
          }
        </div>
      </Modal>

      <Modal open={openModal === 'confirmModal'}>
        <div>
          {
            <ApprovePriceModal
              procedureData={selectedProcedure!}
              onClose={closeModal}
            />
          }
        </div>
      </Modal>

      <section className="ce-px ce-py">
        <div className="flex justify-end gap-4 flex-wrap mt-5">
          <button onClick={() => openModalFn('priceModal')} className="ce-btn">
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

          <Table
            loading={isLoading}
            data={paginatedResponse?.resultItem ?? []}
            columns={columns(ProcedureMapping, openModalFn, closeModal)}
            tableHeading="All Procedures"
          />
          <TablePagination
            component="div"
            count={total}
            page={currentPage - 1}
            labelRowsPerPage="Items per page"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPage={pageSize}
          />
        </div>
      </section>
    </>
  );
};

export default PriceManagement;

const ReportsListDropdown = ({
  cb,
  data,
  openModalFn,
  closeModalFn,
}: {
  cb: (e: React.MouseEvent<HTMLButtonElement>) => void;
  data: any;
  openModalFn: (view: ModalTypes, selectedProcedure: IMedservice) => void;
  closeModalFn: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    cb(event);
    setAnchorEl(event.currentTarget);
  };

  anchorEl && console.log('data', data);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = () => {};

  return (
    <>
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
          <MenuItem onClick={() => openModalFn('editPriceModal', data)}>
            <ListItemIcon>
              <img src={Assets.Icons.ReportEditIcon} alt="" />
            </ListItemIcon>
            <ListItemText>Edit Test</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuAction}>
            <ListItemIcon>
              <img src={Assets.Icons.ReportViewProfileIcon} alt="" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};
