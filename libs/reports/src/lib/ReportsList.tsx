import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {
  ListItemIcon,
  ListItemText,
  TablePagination,
  Modal,
} from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { usePapaParse } from 'react-papaparse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';

import { IProcedure, IUser } from '@cloud-equipment/models';
import * as Assets from '@cloud-equipment/assets';
import queries from './queries/reports';
import { Table } from '@cloud-equipment/ui-components';
import { formatDate } from '@cloud-equipment/utils';
import { UploadReportModal } from '../index';
import { EditReportModal } from './modals';
import numeral from 'numeral';
// import { useFilters } from '@cloud-equipment/hooks';
// import { environment } from '@cloud-equipment/environments';

export type ActionType =
  | null
  | 'view'
  | 'shareResult'
  | 'confirmTest'
  | 'uploadResult'
  | 'edit';

type ReportTableColumns = IProcedure & {
  elipsis: 'elipsis';
  isRebate: string;
  rebatePercent: string;
};

const columnHelper = createColumnHelper<ReportTableColumns>();

const columns = [
  columnHelper.accessor('date', {
    header: 'Date and Time',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('medServiceName', {
    header: 'Procedure/Test Ordered',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('subotal', {
    header: 'Amount',
    cell: (info) => `₦ ${numeral(info.getValue()).format('0,0.00')}`,
  }),
  columnHelper.accessor('isRebate', {
    header: 'Has Rebate',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('rebatePercent', {
    header: 'Rebate Percent',
    cell: (info) => `${info.getValue() ? info.getValue() + '%' : '-'}`,
  }),
  columnHelper.accessor('rebatePaid', {
    header: 'Rebate Amount',
    cell: (info) => `₦ ${numeral(info.getValue()).format('0,0.00')}`,
  }),
  columnHelper.accessor('totalAfterDisc', {
    header: 'Amount After Deduction',
    cell: (info) => `₦ ${numeral(info.getValue()).format('0,0.00')}`,
  }),
  columnHelper.accessor('elipsis', {
    cell: ({
      row: {
        original: { procedureEntryId, ...rest },
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
            procedureEntryId: procedureEntryId.toString(),
            data: { ...rest, procedureEntryId },
          }}
        />
      );
    },
    header: '',
  }),
];

const ReportsList = () => {
  const userDetails = useSelector(
    (state: { auth: { user: IUser } }) => state.auth.user
  );

  const accountType = useSelector(
    (state: { account: { accountType: 0 | 1 } }) => state.account.accountType
  );

  const { jsonToCSV } = usePapaParse();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { useGetReports, useExportReports } = queries;
  const { isLoading, data } = useGetReports(
    {
      pageSize,
      currentPage,
      startIndex: 1,
    },
    accountType === 0 ? null : (userDetails?.FACILITY_ID as string)
  );

  const { mutateFn: mutateFn_exportCsv } = useExportReports(
    accountType === 0 ? null : (userDetails?.FACILITY_ID as string)
  );

  const [selectedProcedure, setSelectedProcedure] = useState<null | IProcedure>(
    null
  );

  const handleChangePage = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setCurrentPage(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  const exportCsv = () => {
    mutateFn_exportCsv({}, async (data: any) => {
      await TransformObject(data?.data?.resultItem);
      console.log(jsonToCSV([data?.data?.resultItem]));

      // Usage example with your data
      // const _data =
      //   'circus,Kidney Test 2,-,19,Olatunde Afolayan,-,"20b u.s umoh crescent, abuleegba. lagos",-,-,09023638048,-,tunderoxyafolayan@gmail.com,-,-,-,-,2000,PENDING,-,-,0,-,-,-,-,No,00426fb5-6087-46fd-8382-a700e6a45252,6,1,2000,2000,0038b80a-57f0-451e-9ab5-4cdfe3e2a841,-,-,-,a19cafa9-dae0-41af-b0de-2acc39cca893,bce4892d-031d-4ece-a467-4241b0e3694c,2024-03-18T17:10:53.6545652,-,2024-03-18T17:10:52.993,57';
      //  downloadDataAsCSV(jsonToCSV([data?.data?.resultItem]), 'reports.csv');
    });
  };

  return (
    <section className="ce-px ce-py">
      <h4 className="text-ce-green font-bold text-2xl">
        <span className="font-normal">Hello</span> ,{' '}
        {userDetails?.USER_FULLNAME}
      </h4>

      <p className="text-greyText2 text-sm">
        Stay up to date with your patients' reports.
      </p>

      <div className="flex justify-end mt-5">
        <Link to="/reports/new">
          <button className="ce-btn ce-btn-icon">
            <img src={Assets.Icons.ReportBtn} alt="" />
            <span>New Report</span>
          </button>
        </Link>
      </div>

      <div className="p-[16px] bg-[white] mt-[20px] rounded-[20px]">
        <h4 className="ce-heading-2">All Reports</h4>

        <div className="grid mt-6 gap-5 grid-cols-[1fr_1fr] lg:flex items-center lg:justify-between">
          <div className="col-span-2 lg:col-span-[unset] lg:w-[50%] search-input-container">
            <input placeholder="Search for Patient Name" />
            <img src={Assets.Icons.Search} alt="" />
          </div>

          <div className="sort-container">
            <span className="sort-text">Sort by:</span>

            <span className="sort-value">Newest to Oldest</span>

            <img src={Assets.Icons.SolidArrowDown} alt="" />
          </div>

          <button onClick={exportCsv} className="export-btn">
            <img src={Assets.Icons.ExportIcon} alt="" />
            <span>Export</span>
          </button>
        </div>

        <Table
          loading={isLoading}
          data={data?.resultItem || []}
          columns={columns}
          tableHeading="All Reports"
        />

        <TablePagination
          component="div"
          count={data?.totalCount ?? 0}
          page={currentPage}
          labelRowsPerPage="Items per page"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPage={pageSize}
        />
      </div>
    </section>
  );
};

export default ReportsList;

const TransformObject = (data: { [key: string]: any }): Promise<any> => {
  return new Promise((resolve) => {
    resolve(
      Object.keys(data).forEach((key) => {
        if ([null, ''].includes(data[key])) data[key] = '-';
      })
    );
  });
};

const ReportsListDropdown = ({
  cb,
  procedureEntryId,
  data,
}: {
  cb: (e: React.MouseEvent<HTMLButtonElement>) => void;
  procedureEntryId: string;
  data: any;
}) => {
  const navigate = useNavigate();
  const { jsonToCSV } = usePapaParse();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { useConfirmTest } = queries;
  const { mutateFn } = useConfirmTest();

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    cb(event);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onClose = () => setShowUploadModal(false);
  const onClose2 = () => setShowEditModal(false);

  const handleActionsClick = async (view: ActionType) => {
    if (view === 'shareResult') {
      await TransformObject(data);
      console.log(jsonToCSV([data]));
    } else if (view === 'confirmTest') {
      mutateFn(
        {
          procedureEntrId: data?.procedureEntryId,
          procedureNewStatus: 1,
        },
        () => {}
      );
    } else if (view === 'uploadResult') {
      setShowUploadModal(true);
    } else if (view === 'edit') {
      setShowEditModal(true);
    }
  };

  const handleMenuAction = () => {
    navigate(`/reports/view/${procedureEntryId}`);
  };

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
          <MenuItem onClick={() => handleActionsClick('edit')}>
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

          <MenuItem onClick={() => handleActionsClick('confirmTest')}>
            <ListItemIcon>
              <img src={Assets.Icons.ReportConfirmIcon} alt="" />
            </ListItemIcon>
            <ListItemText>Confirm Test</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleActionsClick('uploadResult')}>
            <ListItemIcon>
              <img src={Assets.Icons.ReportUploadIcon} alt="" />
            </ListItemIcon>
            <ListItemText>Upload Result</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleActionsClick('shareResult')}>
            <ListItemIcon>
              <img src={Assets.Icons.ReportShareIcon} alt="" />
            </ListItemIcon>
            <ListItemText>Share Result</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      <Modal open={showUploadModal} onClose={onClose}>
        <UploadReportModal onClose={onClose} />
      </Modal>
      <Modal
        open={showEditModal}
        onClose={onClose2}
        style={{ overflow: 'auto' }}
      >
        <EditReportModal onClose={onClose2} />
      </Modal>
    </>
  );
};

function downloadDataAsCSV(data: any, filename: string) {
  // Convert the data to a CSV string
  const csvString = [
    // CSV header
    'facilityName,medServiceName,categoryName,patientName,address,procedureCategory,referrersName,patientEmail,totalAfterDisc,procedureEntryStatus,rebatePercent,refererName,rebatePaid,refererHospital,refererEmail,refererPhone,discountPercent,isRebate,patientId,medServiceId,quantity,amount,subotal,facilityId,remarks,faclityDiscountId,procedureDiscountId,entryUserId,trackId,date,rebateId,appointmentDate,procedureEntryId',
    // CSV row
    data,
  ].join('\n');

  // Create a Blob from the CSV string
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element and set its href attribute to the Blob URL
  const link = document.createElement('a');
  link.href = url;

  // Set the download attribute to specify the filename
  link.download = filename;

  // Append the anchor to the document
  document.body.appendChild(link);

  // Simulate a click on the anchor
  link.click();

  // Clean up by removing the anchor and revoking the Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
