import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import { usePickupLocationQuery } from '@/data/pickupLocation';
import CreateOrUpdatePickupLocationForm from '@/components/pickup_location/pickup-location-form';

export default function UpdateLocationPage() {
    const { query, locale } = useRouter();
    const { t } = useTranslation();
    const { pickupLocation, loading, error } = usePickupLocationQuery({
        slug: query.pickupLocationSlug as string,
        language:
            query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
    });

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <>
            <div className="flex border-b border-dashed border-gray-300 py-5 sm:py-8">
                <h1 className="text-lg font-semibold text-heading">
                    {t('form:form-title-edit-locations')}
                </h1>
            </div>

            <CreateOrUpdatePickupLocationForm initialValues={pickupLocation} />
        </>
    );
}
UpdateLocationPage.authenticate = {
    permissions: adminOnly,
};
UpdateLocationPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common'])),
    },
});
