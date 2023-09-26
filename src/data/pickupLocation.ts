import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { GetParams, pickupLocationQueryOptions, PickupLocationPaginator, PickupLocation } from '@/types';
import { Config } from '@/config';
import { pickupLocationClient } from './client/pickup-location';

export const useCreatePickupLocationMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(pickupLocationClient.create, {
        onSuccess: () => {
            Router.push(Routes.location.list, undefined, {
                locale: Config.defaultLanguage,
            });
            toast.success(t('common:successfully-created'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.LOCATIONS);
        },
    });
};

export const useDeletePickupLocationMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(pickupLocationClient.delete, {
        onSuccess: () => {
            toast.success(t('common:successfully-deleted'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.LOCATIONS);
        },
    });
};

export const useUpdatePickupLocationMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation(pickupLocationClient.update, {
        onSuccess: () => {
            toast.success(t('common:successfully-updated'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.LOCATIONS);
        },
    });
};

export const usePickupLocationQuery = ({ slug, language }: GetParams) => {
    const { data, error, isLoading } = useQuery<PickupLocation, Error>(
        [API_ENDPOINTS.LOCATIONS, { slug, language }],
        () => pickupLocationClient.get({ slug, language })
    );
    return {
        pickupLocation: data,
        error,
        loading: isLoading,
    };
};

export const usePickupLocationsQuery = (options: Partial<pickupLocationQueryOptions>) => {
    const { data, error, isLoading } = useQuery<PickupLocationPaginator, Error>(
        [API_ENDPOINTS.LOCATIONS, options],
        ({ queryKey, pageParam }) =>
            pickupLocationClient.paginated(Object.assign({}, queryKey[1], pageParam)),
        {
            keepPreviousData: true,
        }
    );

    return {
        pickupLocations: data?.data ?? [],
        paginatorInfo: mapPaginatorData(data),
        error,
        loading: isLoading,
    };
};
