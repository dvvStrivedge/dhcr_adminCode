import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { SortOrder } from '@/types';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import FeatureList from '@/components/feature/feature-list';
import { useFeaturesQuery } from '@/data/feature';

export default function Features() {
    const { t } = useTranslation();
    const { locale } = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [orderBy, setOrder] = useState('created_at');
    const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
    const {
        features,
        loading: loading,
        paginatorInfo,
        error,
    } = useFeaturesQuery({
        limit: 10,
        orderBy,
        sortedBy,
        name: searchTerm,
        page,
        language: locale,
    });

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;

    function handleSearch({ searchText }: { searchText: string }) {
        setSearchTerm(searchText);
    }

    function handlePagination(current: any) {
        setPage(current);
    }

    return (
        <>
            <Card className="mb-8 flex flex-col items-center xl:flex-row">
                <div className="mb-4 md:w-1/4 xl:mb-0">
                    <h1 className="text-xl font-semibold text-heading">
                        {t('common:sidebar-nav-item-features')}
                    </h1>
                </div>

                <div className="ms-auto flex w-full flex-col items-center space-y-4 md:flex-row md:space-y-0 xl:w-1/2">
                    <Search onSearch={handleSearch} />

                    {locale === Config.defaultLanguage && (
                        <LinkButton
                            href={`${Routes.feature.create}`}
                            className="md:ms-6 h-12 w-full md:w-auto"
                        >
                            <span className="block md:hidden xl:block">
                                + {t('form:button-label-add-feature')}
                            </span>
                            <span className="hidden md:block xl:hidden">
                                + {t('form:button-label-add')}
                            </span>
                        </LinkButton>
                    )}
                </div>
            </Card>

            <FeatureList
                features={features}
                onPagination={handlePagination}
                onOrder={setOrder}
                onSort={setColumn}
                paginatorInfo={paginatorInfo}
            />
        </>
    );
}
Features.authenticate = {
    permissions: adminOnly,
};
Features.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
    },
});
