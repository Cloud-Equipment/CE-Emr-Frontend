import React from 'react';
import * as Assets from '@cloud-equipment/assets';
import { DashboardCard } from '@cloud-equipment/ui-components';
import DashboardCalendar from '../../components/dashboard/DashboardCalendar';
import AppointmentTimeLine from '../../components/dashboard/AppointmentTimeLine';
import PatientActivityChart from '../../components/dashboard/PatientActivityChart';
import MonthlyRevenueChart from '../../components/dashboard/MonthlyRevenueChart';
import queries from '../../services/queries/dashboard';

const Dashboard = () => {
  const { useGetDashboardSummary } = queries;
  const { isLoading, data: DashboardSummary } = useGetDashboardSummary(
    `/dashboard-manager/superadmin/cards`
  );

  return (
    <section className="ce-px ce-py grid xl:grid-cols-[1fr_auto] gap-5">
      <div>
        <div className="md:flex justify-between md:items-center gap-4">
          <div className="flex gap-2 items-center">
            <img
              src={Assets.Images.Temp.DummyUserIcon3}
              alt="User Profile Pic"
            />
            <div>
              <h3 className="text-ce-green text-2xl">
                <span className="font-normal">Hello,</span> Emma Taylor
              </h3>
              <p className="text-greyText2">
                Check your activities in this dashboard.
              </p>
            </div>
          </div>
        </div>
        <div className="grid mt-5 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <DashboardCard
            icon={Assets.Icons.Dashboard.Calendar}
            text="Referred Patient"
            figure={DashboardSummary?.referredPatient ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.RedCalendar}
            text="In-Patient Today"
            figure={DashboardSummary?.inpatientToday ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.RedTelephone}
            text="Manage Facilities"
            figure={DashboardSummary?.manageFacilities ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.Equipment}
            text="Equipment Management"
            figure={DashboardSummary?.manageEquip ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.Procedure}
            text="Procedure Management"
            figure={DashboardSummary?.procedureManage ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.Price}
            text="Price Management"
            figure={DashboardSummary?.priceMgt ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.Calendar}
            text="Discounts Management"
            figure={DashboardSummary?.dsicountMgt ?? 0}
          />
          <DashboardCard
            icon={Assets.Icons.Dashboard.Facilities}
            text="Facilities Report"
            figure={DashboardSummary?.manageFacilities ?? 0}
          />
        </div>

        <div className="grid 2xl:grid-cols-2 mt-5 gap-5">
          <PatientActivityChart />
          <MonthlyRevenueChart />
        </div>
      </div>

      <div className="bg-white rounded-[20px] px-3 grid gap-x-5 md:grid-cols-2 xl:grid-cols-[unset]">
        <DashboardCalendar />
        <AppointmentTimeLine />
      </div>
    </section>
  );
};

export default Dashboard;
