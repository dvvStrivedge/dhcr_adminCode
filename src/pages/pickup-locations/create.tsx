import { useTranslation } from 'next-i18next';
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import CreateOrUpdatePickupLocationForm from '@/components/pickup_location/pickup-location-form';

export default function CreatePickupLocationsPage() {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex border-b border-dashed border-gray-300 py-5 sm:py-8">
                <h1 className="text-lg font-semibold text-heading">
                    {t('form:button-label-add-location')}
                </h1>
            </div>
            <CreateOrUpdatePickupLocationForm />
        </>
    );
}
CreatePickupLocationsPage.authenticate = {
    permissions: adminOnly,
};
CreatePickupLocationsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common'])),
    },
});
