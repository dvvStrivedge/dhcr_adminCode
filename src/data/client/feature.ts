import { crudFactory } from '@/data/client/curd-factory';
import {
  QueryOptions,
  Feature,
  CreateFeatureInput,
  FeaturePaginator,
  FeatureQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const featureClient = {
  ...crudFactory<Feature, QueryOptions, CreateFeatureInput>(API_ENDPOINTS.FEATURES),
  paginated: ({ type, name, ...params }: Partial<FeatureQueryOptions>) => {
    return HttpClient.get<FeaturePaginator>(API_ENDPOINTS.FEATURES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
