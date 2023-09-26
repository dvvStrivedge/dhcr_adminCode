import { useTranslation } from 'next-i18next';
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import CreateOrUpdateFeatureForm from '@/components/feature/feature-form';

export default function CreateCategoriesPage() {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex border-b border-dashed border-gray-300 py-5 sm:py-8">
                <h1 className="text-lg font-semibold text-heading">
                    {t('form:button-label-add-feature')}
                </h1>
            </div>
            <CreateOrUpdateFeatureForm />
        </>
    );
}
CreateCategoriesPage.authenticate = {
    permissions: adminOnly,
};
CreateCategoriesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common'])),
    },
});
