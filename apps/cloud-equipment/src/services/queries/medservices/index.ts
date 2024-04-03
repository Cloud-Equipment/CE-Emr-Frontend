import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import { apiClient } from '@cloud-equipment/api';
import { ApiResponse, PaginationData } from 'Models/api.models';
import keys from './keys';
import { IMedservice, IProcedureCategory } from '@cloud-equipment/models';
import { environment } from '@cloud-equipment/environments';

// url: `/service-manager/medServices/getall`
const useGetPrices = (
  url: string,
  body: any,
  options: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'initialData' | 'queryFn' | 'queryKey'
  > = {},
  pageNumber: string = '1'
) => {
  const hash = [keys.read, 'all', `${pageNumber}`];
  const {
    isLoading,
    data,
    isSuccess,
    error,
  }: UseQueryResult<PaginationData<IMedservice>, unknown> = useQuery({
    queryKey: hash,
    queryFn: () =>
      apiClient
        .post({ url, body, auth: true })
        .then((res: ApiResponse<PaginationData<IMedservice>>) => res.data),
    ...options,
  });
  return { isLoading, data, isSuccess, error };
};

const useGetMedservicesForFacility = (
  body: {
    facilityId: string;
    download: boolean;
    currentPage: number;
    startIndex: number;
    pageSize: number;
  },
  options: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'initialData' | 'queryFn' | 'queryKey'
  > = {}
) => {
  const { facilityId, download, currentPage, startIndex, pageSize } = body;
  const hash = [
    keys.read,
    facilityId,
    download,
    currentPage,
    startIndex,
    pageSize,
  ];
  const {
    isLoading,
    data,
    isSuccess,
    error,
  }: UseQueryResult<PaginationData<IMedservice>> = useQuery({
    queryKey: hash,
    queryFn: () =>
      apiClient
        .post({
          url: `${environment.baseUrl}/service-manager/medServices/getallbyfacilitypaged`,
          params: { facilityId },
          body: {
            download,
            currentPage,
            startIndex,
            pageSize,
          },
          auth: true,
        })
        .then((res: ApiResponse) => res.data),
  });
  return { isLoading, data, isSuccess, error };
};

// /service-manager/medServiceCategory/getallcategory
const useGetMedServicesProcedureCategories = (
  url: string,
  options: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'initialData' | 'queryFn' | 'queryKey'
  > = {}
) => {
  const hash = [keys.readOne];
  const {
    isLoading,
    data,
    isSuccess,
    error,
  }: UseQueryResult<IProcedureCategory[], unknown> = useQuery({
    queryKey: hash,
    queryFn: () =>
      apiClient
        .get({ url })
        .then((res: ApiResponse<IProcedureCategory[]>) => res.data),
    ...options,
  });
  return { isLoading, data, isSuccess, error };
};

const queries = {
  useGetMedservicesForFacility,
  useGetPrices,
  useGetMedServicesProcedureCategories,
};

export default queries;
