import DashboardCalendar from '../../components/dashboard/DashboardCalendar';
import AppointmentTimeLine from '../../components/dashboard/AppointmentTimeLine';
import { useSelector } from 'react-redux';
import { IAppState } from '../../Store/store';
import appointmentQueries from '../../services/queries/appointments';
import { UserTypeEnum } from '@cloud-equipment/models';
import ReceptionistDashboardSub from '../../components/dashboard/ReceptionistDashboardSub';
import { Menu, MenuItem, ListItemText, Modal } from '@mui/material';
import * as Assets from '@cloud-equipment/assets';
import { useState } from 'react';
import { Button } from '@cloud-equipment/ui-components';
import FacilityAdminDashboardSub from '../../components/dashboard/FacilityAdminDashboardSub';
import AppointmentModal from '../../components/dashboard/AppointmentModal';
import dayjs, { Dayjs } from 'dayjs';

const Dashboard = () => {
  const userDetails = useSelector((state: IAppState) => state.auth.user);
  //   menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // modals
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const openAppointmentModal = () => {
    setAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => setAppointmentModalOpen(false);

  const [date, setDate] = useState<Dayjs>(dayjs());

  const { data: appointmentData } =
    appointmentQueries.useGetUpcomingAppointments(
      `/facility-manager/facility/getfacilityappointmentdayily?facilityId=${userDetails?.FACILITY_ID}&currentPage=1&startIndex=0&pageSize=10`,
      dayjs(date).format('YYYY-MM-DD')
    );

  return (
    <>
      <Modal open={appointmentModalOpen} onClose={closeAppointmentModal}>
        <div>{<AppointmentModal onClose={closeAppointmentModal} />}</div>
      </Modal>

      <section className="ce-px ce-py grid xl:grid-cols-[1fr_auto] gap-5">
        <div className="grid grid-cols-1">
          <div className="md:flex justify-between md:items-center gap-4">
            <div>
              <h3 className="text-ce-green text-2xl font-bold">
                <span className="font-normal">Hello,</span>{' '}
                {userDetails?.USER_FULLNAME}
              </h3>
              <p className="text-greyText2">
                Check your activities in this dashboard.
              </p>
            </div>

            <Button
              variant="primary"
              className="!bg-ce-green [z-index:2]"
              onClick={(e) => handleActionClick(e)}
              label="New"
              icon={Assets.Icons.WhitePlus}
            />
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
                  handleMenuClose();
                }}
              >
                <ListItemText>New Patient</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openAppointmentModal();
                  handleMenuClose();
                }}
              >
                <ListItemText>New Appointment</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                }}
              >
                <ListItemText>New Report</ListItemText>
              </MenuItem>
            </Menu>
          </div>
          {userDetails?.userType === UserTypeEnum.FACILITY_ADMIN ? (
            <FacilityAdminDashboardSub />
          ) : (
            <ReceptionistDashboardSub />
          )}
        </div>

        <div className="bg-white rounded-[20px] px-3 grid gap-x-5 md:grid-cols-2 xl:grid-cols-[unset] xl:block">
          <DashboardCalendar
            date={date}
            onDateChange={(value) => {
              setDate(value);
            }}
          />
          <AppointmentTimeLine data={appointmentData} />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
