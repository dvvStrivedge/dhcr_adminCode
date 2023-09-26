import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { TagQueryOptions, GetParams, TagPaginator, Tag, Include, includeQueryOptions, IncludePaginator } from '@/types';
import { Config } from '@/config';
import { includeClient } from './client/include';

export const useCreateIncludeMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(includeClient.create, {
        onSuccess: () => {
            Router.push(Routes.include.list, undefined, {
                locale: Config.defaultLanguage,
            });
            toast.success(t('common:successfully-created'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.INCLUDES);
        },
    });
};

export const useDeleteIncludeMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(includeClient.delete, {
        onSuccess: () => {
            toast.success(t('common:successfully-deleted'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.INCLUDES);
        },
    });
};

export const useUpdateIncludeMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation(includeClient.update, {
        onSuccess: () => {
            toast.success(t('common:successfully-updated'));
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.INCLUDES);
        },
    });
};

export const useIncludeQuery = ({ slug, language }: GetParams) => {
    const { data, error, isLoading } = useQuery<Include, Error>(
        [API_ENDPOINTS.TYPES, { slug, language }],
        () => includeClient.get({ slug, language })
    );
    return {
        include: data,
        error,
        loading: isLoading,
    };
};

export const useIncludesQuery = (options: Partial<includeQueryOptions>) => {
    const { data, error, isLoading } = useQuery<IncludePaginator, Error>(
        [API_ENDPOINTS.INCLUDES, options],
        ({ queryKey, pageParam }) =>
            includeClient.paginated(Object.assign({}, queryKey[1], pageParam)),
        {
            keepPreviousData: true,
        }
    );

    return {
        includes: data?.data ?? [],
        paginatorInfo: mapPaginatorData(data),
        error,
        loading: isLoading,
    };
};
