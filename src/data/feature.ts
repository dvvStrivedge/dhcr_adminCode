import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { GetParams, Feature, FeatureQueryOptions, FeaturePaginator } from '@/types';
import { featureClient } from '@/data/client/feature';
import { Config } from '@/config';

export const useCreateFeatureMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(featureClient.create, {
    onSuccess: () => {
      Router.push(Routes.feature.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FEATURES);
    },
  });
};

export const useDeleteFeatureMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(featureClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FEATURES);
    },
  });
};

export const useUpdateFeatureMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(featureClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FEATURES);
    },
  });
};

export const useFeatureQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Feature, Error>(
    [API_ENDPOINTS.TYPES, { slug, language }],
    () => featureClient.get({ slug, language })
  );
  return {
    feature: data,
    error,
    loading: isLoading,
  };
};

export const useFeaturesQuery = (options: Partial<FeatureQueryOptions>) => {
  const { data, error, isLoading } = useQuery<FeaturePaginator, Error>(
    [API_ENDPOINTS.FEATURES, options],
    ({ queryKey, pageParam }) =>
      featureClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    features: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
