import { Checkbox } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import * as Assets from '@cloud-equipment/assets';
import appointmentQueries from '../../services/queries/appointments';
import { useSelector } from 'react-redux';
import { IAppState } from '../../Store/store';
import { UserTypeEnum } from '@cloud-equipment/models';

const LatestPatientActivities = () => {
  const userDetails = useSelector((state: IAppState) => state.auth.user);

  const { data } = appointmentQueries.useGetAppointmentsDaily(
    {
      facilityId: userDetails?.FACILITY_ID as string,
      currentPage: 1,
      startIndex: 0,
      pageSize: 20,
      userId: userDetails?.USER_ID as string,
      // apponitmentFrom: dayjs(date).format('YYYY-MM-DD'),
      // apponitmentTo: dayjs(date).format('YYYY-MM-DD'),
    },
    userDetails?.USER_ROLE?.includes(UserTypeEnum.FACILITY_ADMIN) ? false : true
  );

  return (
    <div className="mt-5 bg-white p-5 rounded-[20px]">
      <h3 className="text-lg font-bold">Latest Patient Activities</h3>

      <div className="mt-4 dashboard-table-holder">
        <table>
          <thead>
            <tr>
              <th className="!text-center">#</th>
              <th>Date</th>
              <th>User ID</th>
              <th className="!pl-8">Name</th>
              <th>Diagnostics</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>

          <tbody>
            {data?.resultItem.map((item, index) => (
              <tr key={index}>
                <td>
                  <Checkbox />
                </td>
                <td>
                  {moment(item.appointmentDate).format('DD-MM-YYYY . h:mm: A')}
                </td>
                <td>{item.patientUniqueID?.substring(0, 5)}..</td>
                <td>
                  <div className="grid grid-cols-[40px,1fr] items-center gap-2">
                    <img src={Assets.Images.Temp.DummyUserIcon2} alt="" />
                    <div className="">
                      <p>{item.patientName}</p>
                      <p className="font-medium text-sm">{item.patientEmail}</p>
                    </div>
                  </div>
                </td>
                <td>{item.medServiceName}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className={`block w-2 h-2 rounded-full ${
                        item.procedureEntryStatus?.toLowerCase() === 'approved'
                          ? ' bg-greenText'
                          : ' bg-pending'
                      }`}
                    ></div>
                    <span
                      className={`${
                        item.procedureEntryStatus?.toLowerCase() === 'approved'
                          ? ' text-greenText'
                          : ' text-pending'
                      }`}
                    >
                      {item.procedureEntryStatus}
                    </span>
                  </div>
                </td>
                <td> </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <TablePagination
              component="div"
              count={total}
              page={currentPage}
              labelRowsPerPage="Items per page"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPage={pageSize}
            /> */}
      </div>
    </div>
  );
};

export default LatestPatientActivities;
