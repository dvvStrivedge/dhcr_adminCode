import { crudFactory } from '@/data/client/curd-factory';
import {
    CreateIncludeInput,
    Include,
    IncludePaginator,
    QueryOptions,
    includeQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const includeClient = {
    ...crudFactory<Include, QueryOptions, CreateIncludeInput>(API_ENDPOINTS.INCLUDES),
    paginated: ({ type, name, ...params }: Partial<includeQueryOptions>) => {
        return HttpClient.get<IncludePaginator>(API_ENDPOINTS.INCLUDES, {
            searchJoin: 'and',
            ...params,
            search: HttpClient.formatSearchParams({ type, name }),
        });
    },
};
