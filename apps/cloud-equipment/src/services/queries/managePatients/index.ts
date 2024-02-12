import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import apiMethods from '../../api';
import { IPatient } from './types';
import { ApiResponse, PaginationData } from 'Models/api.models';
import keys from './keys';
import { showToast } from '@cloud-equipment/utils';

const useGetPatients = (
  url: string,
  options: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'initialData' | 'queryFn' | 'queryKey'
  > = {},
  pageNumber: string = '1'
) => {
  const hash = [keys.read, `${pageNumber}`];
  const {
    isLoading,
    data,
    isSuccess,
    error,
  }: UseQueryResult<PaginationData<IPatient>, unknown> = useQuery({
    queryKey: hash,
    queryFn: () =>
      apiMethods
        .get({ url, auth: true })
        .then((res: ApiResponse<PaginationData<IPatient>>) => res.data),
    ...options,
  });
  return { isLoading, data, isSuccess, error };
};

const useDisableUser = (options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,
    mutationKey: [keys.create],
    mutationFn: async (data: any) => {
      return apiMethods.post({
        url: `/user-manager/account/user/disableuser?userId=${data?.id}`,
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
    mutateFn: (bodyArg: any, successCb?: () => void) => {
      return mutate(bodyArg, {
        onSuccess: (res) => {
          showToast(res.message || 'User Disabled Successfully', 'success');
          setTimeout(() => {
            successCb?.();
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

const useEnableUser = (options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,
    mutationKey: [keys.create],
    mutationFn: async (data: any) => {
      return apiMethods.post({
        url: `/user-manager/account/user/enableuser?userId=${data?.id}`,
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
    mutateFn: (bodyArg: any, successCb?: () => void) => {
      return mutate(bodyArg, {
        onSuccess: (res) => {
          showToast(res.message || 'User Enabled Successfully', 'success');
          setTimeout(() => {
            successCb?.();
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

const useUpdateUser = (options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,
    mutationKey: [keys.create],
    mutationFn: async (data: any) => {
      const { id } = data;
      return apiMethods.patch({
        url: `/user-manager/account/user/update?userId=${id}`,
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.read] });
    },
  });
  const { mutate, isSuccess, isError, data, isPending } = mutation;

  return {
    mutateFn: (bodyArg: any, successCb: () => void) => {
      return mutate(bodyArg, {
        onSuccess: (res) => {
          showToast(
            res.message || 'User details updated Successfully',
            'success'
          );
          setTimeout(() => {
            successCb?.();
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
  useGetPatients,
  useUpdateUser,
  useDisableUser,
  useEnableUser,
};

export default queries;