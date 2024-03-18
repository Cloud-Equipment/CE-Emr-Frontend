import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TablePagination,
  ListItemIcon,
} from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';

import { InviteUserModal } from './InviteUserModal';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { Enable2FAModal } from './Enforce2FaModal';
import * as Assets from '@cloud-equipment/assets';
import { Button, Table, Loader } from '@cloud-equipment/ui-components';
import queries from '../../../services/queries/manageUsers';
import { IAppState } from '../../../Store/store';
import { formatDate } from '@cloud-equipment/utils';

type IModalViews =
  | null
  | 'inviteUser'
  | 'enable2Fa'
  | 'createUser'
  | 'editUser';

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('dateCreated', {
    header: 'Date & Time Added',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row: { original } }) => {
      return `${original?.firstName} ${original?.lastName}`;
    },
  }),
  columnHelper.accessor('email', {
    header: 'Email Address',
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('twoFactorEnabled', {
    header: '2FA Status',
    cell: (info) => {
      return (
        <span className="flex gap-1 items-center">
          {info.getValue() ? (
            <>
              <div className="w-[5px] h-[5px] bg-primary-300 rounded-full"></div>{' '}
              Yes
            </>
          ) : (
            <>No</>
          )}
        </span>
      );
    },
  }),
  columnHelper.accessor('roles', {
    header: 'Role',
    cell: (info) => info.getValue()?.[0] || '-',
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last login',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('elipsis', {
    cell: ({
      row: {
        original: { id, isActive, ...rest },
      },
    }) => {
      // REFACTOR: is this necessary
      const cb = (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log('e', e);
      };
      return <ManageStaffDropDown {...{ cb, id, isActive, rest }} />;
    },
    header: '',
  }),
];

const UserManagement = () => {
  const { user } = useSelector((state: IAppState) => state.auth);

  const { useGetUsers } = queries;
  const { isLoading, data: userData } = useGetUsers(
    `/user-manager/account/user/getallusersfacility?facilityId=${user?.FACILITY_ID}&currentPage=1&startIndex=1&pageSize=10`,
    { facilityId: user ? user.FACILITY_ID : '' },
    { enabled: !!user?.FACILITY_ID },
    '1'
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handleChangePage = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setCurrentPage(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {/* Enable 2Fa Modal */}

      <section className="ce-px ce-py">
        <div className="flex justify-end">
          <SelectActionDropDown />
        </div>

        <div className="p-[16px] bg-[white] mt-[20px] rounded-[20px]">
          <h4 className="ce-heading-2">Users</h4>

          <div className="grid mt-6 gap-5 grid-cols-[1fr_1fr] lg:flex items-center lg:justify-between">
            <div className="col-span-2 lg:col-span-[unset] lg:w-[50%] search-input-container">
              <input placeholder="Search for Patient Name" />
              <img src={Assets.Icons.Search} alt="search icon" />
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
            data={userData?.resultItem || []}
            columns={columns}
            tableHeading={`Team members - 5`}
          />
          <TablePagination
            component="div"
            count={total}
            page={currentPage}
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

export default UserManagement;

const ManageStaffDropDown = ({
  cb,
  id,
  isActive,
  rest,
}: {
  cb: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
  isActive: boolean;
  rest: { [key: string]: any };
}) => {
  const { useDisableUser, useEnableUser, useUpdateUser } = queries;
  const { mutateFn: disableFn, isLoading: isDisableLoading } = useDisableUser();
  const { mutateFn: enableFn, isLoading: isEnableLoading } = useEnableUser();
  const { mutateFn: updateUserFn, isLoading: isUpdateLoading } =
    useUpdateUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalViews, setModalViews] = useState<{ currentView: IModalViews }>({
    currentView: null,
  });

  const openModal = (view: IModalViews) => {
    setModalViews({ currentView: view });
  };

  const closeModal = () => {
    setModalViews({ currentView: null });
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    cb(event);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = () => {};

  const data = {
    id,
    firstName: rest.firstName,
    lastName: rest.lastName,
    roles: [],
    phoneNumber: null,
    twoFactorEnabled: true,
  };
  return (
    <div>
      <Modal open={modalViews.currentView === 'editUser'} onClose={closeModal}>
        <div>
          <EditUserModal data={{ ...rest, id }} onClose={closeModal} />
        </div>
      </Modal>
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
        {isActive ? (
          <MenuItem onClick={() => disableFn({ id }, handleMenuClose)}>
            <ListItemIcon>
              {isDisableLoading ? (
                <Loader />
              ) : (
                <img src={Assets.Icons.WhiteCheckmark} alt="" />
              )}
            </ListItemIcon>
            <ListItemText>Disable User</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => enableFn({ id }, handleMenuClose)}>
            <ListItemIcon>
              {isEnableLoading ? (
                <Loader />
              ) : (
                <img src={Assets.Icons.WhiteCheckmark} alt="" />
              )}
            </ListItemIcon>
            <ListItemText>Enable User</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => updateUserFn(data, handleMenuClose)}>
          <ListItemIcon>
            {isUpdateLoading ? (
              <Loader />
            ) : (
              <img src={Assets.Icons.WhiteCheckmark} alt="" />
            )}
          </ListItemIcon>
          <ListItemText>Enable 2FA</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openModal('editUser')}>
          <ListItemIcon>
            <img src={Assets.Icons.WhiteCheckmark} alt="" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

const SelectActionDropDown = () => {
  const [modalViews, setModalViews] = useState<{ currentView: IModalViews }>({
    currentView: null,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = () => {};

  const openModal = (view: IModalViews) => {
    setModalViews({ currentView: view });
  };

  const closeModal = () => {
    setModalViews({ currentView: null });
  };

  return (
    <>
      <Modal
        open={modalViews.currentView === 'createUser'}
        onClose={closeModal}
      >
        <div>
          <CreateUserModal onClose={closeModal} />
        </div>
      </Modal>

      <Modal
        open={modalViews.currentView === 'inviteUser'}
        onClose={closeModal}
      >
        <div>
          <InviteUserModal
            onClose={closeModal}
            openCreateModalFn={() => openModal('createUser')}
          />
        </div>
      </Modal>
      <Modal open={modalViews.currentView === 'enable2Fa'} onClose={closeModal}>
        <div>
          <Enable2FAModal onClose={closeModal} />
        </div>
      </Modal>
      <div>
        <Button
          label="Select Action"
          // TODO: Change this icon
          iconAfter={Assets.Icons.WhiteDropdownIcon}
          onClick={(e) => {
            handleActionClick(e);
          }}
          className="!bg-primary-100 hover:!bg-primary-100"
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => openModal('inviteUser')}>
            <ListItemIcon>
              <img src={Assets.Icons.WhiteCheckmark} alt="" />
            </ListItemIcon>
            <ListItemText>Invite User</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => openModal('createUser')}>
            <ListItemIcon>
              <img src={Assets.Icons.WhiteCheckmark} alt="" />
            </ListItemIcon>
            <ListItemText>Create User</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <img src={Assets.Icons.WhiteCheckmark} alt="" />
            </ListItemIcon>
            <ListItemText>Manage Roles</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => openModal('enable2Fa')}>
            <ListItemIcon>
              <img src={Assets.Icons.WhiteCheckmark} alt="" />
            </ListItemIcon>
            <ListItemText>Enforce 2FA</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};
