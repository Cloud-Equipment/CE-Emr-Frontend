import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';

import * as Assets from '@cloud-equipment/assets';
import {
  Button,
  FileUploadWithModal,
  Table,
} from '@cloud-equipment/ui-components';

// import queries from '../../../services/queries/managePatients';

type PatientTableColumns = { [key: string]: string } & {
  lastLogin: string;
  elipsis: 'elipsis';
};

const columnHelper = createColumnHelper<PatientTableColumns>();

const columns = [
  columnHelper.accessor('dateAndTime', {
    header: 'Date & Time',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('procedure', {
    header: 'Procedure/Test Ordered',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('referrerName', {
    header: 'Referrer’s Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('referrerHospital', {
    header: 'Referrer’s Hospital',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
];

const ViewPatient = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [patientDetails, setPatientDetails] = useState<any>({});

  // const { useGetOnePatient } = queries;
  // const { data, isLoading } = useGetOnePatient(
  //   `/patient/getpatientbyuniqueid/${params?.id}`
  // );
  const data: any = {};

  return (
    <>
      <section className="ce-px ce-py">
        <div className="bg-white rounded-[20px] px-4 py-8">
          <div className="flex justify-between">
            <h3 className="text-2xl">Profile</h3>

            <button onClick={() => navigate(-1)}>
              <img src={Assets.Icons.BoxCloseIcon} alt="" />
            </button>
          </div>

          <div className="mt-10">
            <FileUploadWithModal
              uploadIcon={Assets.Icons.UploadIcon1}
              containerClass="w-[150px]"
              uploadLabel="Click to Upload Image"
              onClick={(cb) => {
                cb();
              }}
              // onChange={}
            />

            <p className="text-greyText2 mt-3">
              User ID: {data?.patientUniqueID || '-'}
            </p>
            <p className="font-semibold text-lg">{data?.patientName || '-'}</p>

            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <Button label="New Appointment" onClick={() => {}} />
              <Button variant="tertiary" label="Refer Patient" className="" />
              <Button
                label="Edit Profile"
                className="border-primary-150 text-secondary-400"
                variant="neutral"
              />
            </div>
          </div>

          <h5 className="text-lg font-medium mt-10">Patient Information</h5>

          <div className="mt-10 [box-shadow:0px_4px_12px_0px_#0D5F5026] rounded-lg py-4 px-16 grid md:grid-cols-3 2xl:grid-cols-6 gap-4 2xl:gap-10">
            <TitleSubtitle
              title="Registration Date & Time"
              subtitle={`${data?.registrationDate || '-'}`}
            />

            <TitleSubtitle
              title="Patient ID"
              subtitle={`${data?.patientUniqueID || '-'}`}
            />

            <TitleSubtitle
              title="Phone Number"
              subtitle={`${data?.patientPhone || '-'}`}
            />

            <TitleSubtitle
              title="Email"
              subtitle={`${data?.patientEmail || '-'}`}
            />

            <TitleSubtitle
              title="Gender"
              subtitle={`${data?.patientGenderId || '-'}`}
            />

            <TitleSubtitle
              title="Date of Birth"
              subtitle={`${data?.dateOfBirth || '-'}`}
            />

            <TitleSubtitle
              title="Age"
              subtitle={`${data?.patientAge || '-'}`}
            />

            <TitleSubtitle
              title="Marital Status"
              subtitle={data?.maritalStatusId || `-`}
            />

            <TitleSubtitle
              title="Address"
              subtitle={`${data?.address || '-'}`}
              className="2xl:col-span-4"
            />

            <TitleSubtitle
              title="Emergency contact Name"
              subtitle={`${data?.emergencyContactFirstname || '-'} ${
                data?.emergencyContactLastName || '-'
              }`}
            />

            <TitleSubtitle
              title="Contact Number"
              subtitle={`${data?.emergencyContactNumber || '-'}`}
            />

            <TitleSubtitle
              title="Relationship"
              subtitle={`${data?.emergencyContactRelationship || '-'}`}
            />

            <TitleSubtitle
              title="Reason for Registration"
              subtitle={`${data?.reasonForRegistration || '-'}`}
            />

            <TitleSubtitle
              title="Taken Drugs"
              subtitle={`${data?.takingMedication || '-'}`}
            />

            <TitleSubtitle
              title="Address Information"
              subtitle={`${data?.address || '-'}`}
              className="col-span-6"
            />
          </div>

          <Table
            loading={false}
            data={[]}
            columns={columns}
            tableHeading="All Report"
          />
        </div>
      </section>
    </>
  );
};
export default ViewPatient;

const TitleSubtitle = ({
  title,
  subtitle,
  className = '',
}: {
  title: string;
  subtitle: string | number;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-base font-medium">{title}</p>
      <p className="text-greyText2">{subtitle || '-'}</p>
    </div>
  );
};