import {
    Product,
    CreateProduct,
    ProductPaginator,
    QueryOptions,
    GetParams,
    ProductQueryOptions,
    NotificationPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const notificationClient = {
    ...crudFactory<Notification, QueryOptions, CreateProduct>(API_ENDPOINTS.NOTIFICATION),
    get({ slug, language }: GetParams) {
        return HttpClient.get<Notification>(`${API_ENDPOINTS.NOTIFICATION}/${slug}`, {
            language,
        });
    },
    paginated: ({
        type,
        name,
        categories,
        shop_id,
        ...params
    }: Partial<ProductQueryOptions>) => {
        return HttpClient.get<NotificationPaginator>(API_ENDPOINTS.NOTIFICATION, {
            searchJoin: 'and',
            ...params,
            // search: HttpClient.formatSearchParams({
            //     type,
            //     name,
            //     categories,
            //     shop_id,
            // }),
        });
    },
    update: (id: number) => {
        return HttpClient.get<string>(
            `notification-read?id=${id}`
        );
    },
};