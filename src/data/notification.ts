import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import {
    NotificationQueryOptions,
    NotificationPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { notificationClient } from './client/notification';

export const useUpdateNotificationMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation(notificationClient.updateNotification, {
        onSuccess: () => {
            // toast.success(t('common:successfully-updated'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.NOTIFICATION_READ);
        },
    });
};

export const useNotificationsQuery = (
    params: Partial<NotificationQueryOptions>,
    options: any = {}
) => {
    const { data, error, isLoading } = useQuery<NotificationPaginator, Error>(
        [API_ENDPOINTS.NOTIFICATION, params],
        ({ queryKey, pageParam }) =>
            notificationClient.paginated(Object.assign({}, queryKey[1], pageParam)),
        {
            keepPreviousData: true,
            ...options,
        }
    );

    return {
        notifications: data?.data ?? [],
        paginatorInfo: mapPaginatorData(data),
        error,
        loading: isLoading,
    };
};
