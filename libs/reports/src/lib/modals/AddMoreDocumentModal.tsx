import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { FileUpload, Input } from '@cloud-equipment/ui-components';
import * as Assets from '@cloud-equipment/assets';
import { Button } from '@cloud-equipment/ui-components';
import queries from '../queries/reports';

interface FormProps {
  note: string;
  document: string;
}

const UploadReportModal = ({ onClose }: { onClose: (e: any) => void }) => {
  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm<FormProps>();
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = (data: FormProps) => {
    const formData = new FormData();
    // formData.append('file', file)
    console.log('Data', data);
  };

  return (
    <div className="bg-white p-10 lg:p-14 centered-modal-md">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-2">
        <h4 className="font-dmsans text-2xl font-normal leading-[36px] text-secondary-550">
          Upload Result
        </h4>
        <hr className="my-5" />
        <Input
          label="Leave a Note"
          containerClass="mb-10"
          placeholder="Enter Document Tile"
          {...register('note', {
            required: 'Note is required ',
          })}
        />

        <FileUpload
          uploadIcon={Assets.Icons.UploadIcon2}
          containerClass="flex-1 mb-10"
          uploadLabel="Drag and drop or <span class='text-primary-150'>choose a file</span> to upload your<br/> contacts."
          uploadRestrictionText="All .csv, .xlsx, and .xls file types are supported"
          borderStyle="solid"
          borderWidth={1}
          color="#1A1A1A"
          setFile={setFile}
        />

        <Button
          className="border-primary-150 text-primary-150 hover:border-primary-150"
          label="Upload Result"
        />
      </form>
    </div>
  );
};

export default UploadReportModal;
