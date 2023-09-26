import AdminLayout from '@/components/layouts/admin';
import CreateOrUpdateProductForm from '@/components/product/product-form';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


export default function CreateProductPage() {
    const { t } = useTranslation();
    // const router = useRouter();
    // const {
    //     query: { shop },
    // } = useRouter();
    // const { permissions } = getAuthCredentials();
    // const { data: me } = useMeQuery();
    // const { data: shopData } = useShopQuery({
    //     slug: shop as string,
    // });
    // console.log("shopData", shopData);

    // const shopId = shopData?.id!;
    // if (
    //     !hasAccess(adminOnly, permissions) &&
    //     !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    //     me?.managed_shop?.id != shopId
    // ) {
    //     router.replace(Routes.dashboard);
    // }

    return (
        <>
            <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
                <h1 className="text-lg font-semibold text-heading">
                    {t('form:form-title-create-product')}
                </h1>
            </div>
            <CreateOrUpdateProductForm />
        </>
    );
}
CreateProductPage.authenticate = {
    permissions: adminOnly,
};
CreateProductPage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common'])),
    },
});
