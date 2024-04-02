import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import { apiClient } from '@cloud-equipment/api';

import { ApiResponse } from 'Models/api.models';
import keys from './keys';
import { environment } from '@cloud-equipment/environments';
import { IPatient } from 'Models/patient.models';
import { showToast } from '@cloud-equipment/utils';

const useSearchPatientByName = (
  patientName: string,
  facilityId: string,
  options: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'initialData' | 'queryFn' | 'queryKey'
  > = {}
) => {
  const hash = [`${keys.searchCustom}`, patientName];
  const { isLoading, data, isSuccess, error }: UseQueryResult<any[]> = useQuery(
    {
      queryKey: hash,
      queryFn: () => {
        if (!patientName) {
          return null;
        }
        return apiClient
          .get({
            url: `${environment.baseUrl}/patient/getpatientbyname`,
            auth: true,
            params: { patientName, facilityId },
          })
          .then((res: ApiResponse<any[]>) => {
            return res.data;
          });
      },
    }
  );
  return { isLoading, data, isSuccess, error };
};

const useGetPatientById = (patientId: string, options = {}) => {
  //   const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,
    mutationKey: [keys.readOne],
    mutationFn: async () => {
      return apiClient.get({
        url: `${environment.baseUrl}/patient/getpatientbyuniqueid/${patientId}`,
        auth: true,
      });
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: [keys.searchCustom] });
    // },
  });
  const { mutate, isSuccess, isError, data, isPending } = mutation;

  return {
    mutateFn: (bodyArg: any, cb: (res: any) => void) => {
      return mutate(bodyArg, {
        onSuccess: (res) => {
          cb?.(res);
        },
      });
    },
    data,
    isSuccess,
    isError,
    isLoading: isPending,
  };
};

const useCreatePatient = (options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,
    mutationKey: [keys.create],
    mutationFn: async (data: FormData) => {
      return apiClient.post({
        url: `/patient/createpatient`,
        body: data,
        auth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.read] });
    },
  });
  const { mutate, isSuccess, isError, data, isPending } = mutation;

  return {
    mutateFn: (bodyArg: FormData, successCb: (res: any) => void) => {
      return mutate(bodyArg, {
        onSuccess: (res) => {
          showToast(res.message || 'Patient Created Successfully', 'success');
          setTimeout(() => {
            successCb?.(res);
          }, 1500);
        },
      });
    },
    data,
    isSuccess,
    isError,
    isLoading: isPending,
  };
};

const queries = {
  useSearchPatientByName,
  useGetPatientById,
  useCreatePatient,
};

export default queries;
