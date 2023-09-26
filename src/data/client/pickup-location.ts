import { crudFactory } from '@/data/client/curd-factory';
import {
  QueryOptions,
  PickupLocation,
  CreatePickupLocationInput,
  pickupLocationQueryOptions,
  PickupLocationPaginator,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const pickupLocationClient = {
  ...crudFactory<PickupLocation, QueryOptions, CreatePickupLocationInput>(API_ENDPOINTS.LOCATIONS),
  paginated: ({ type, name, ...params }: Partial<pickupLocationQueryOptions>) => {
    return HttpClient.get<PickupLocationPaginator>(API_ENDPOINTS.LOCATIONS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
