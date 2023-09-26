import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useProductsQuery } from '@/data/product';
import { useEffect, useState } from 'react';
import { productClient } from '@/data/client/product';
import { useMutation } from 'react-query';

interface Props {
    control: Control<any>;
    setValue: any;
}

const RelatedProductInput = ({ control, setValue }: Props) => {
    const { locale } = useRouter();
    const { t } = useTranslation('common');
    const [products, setProducts] = useState<any[]>([]);
    const { mutate: getProducts } = useMutation(productClient.all, {
        onSuccess: (data: any) => {
            setProducts(data.data);
        },
    });
    useEffect(() => {
        getProducts(
            {
                language: locale,
                limit: 100,
            },
        );
    }, []);

    return (
        <div className="mb-5">
            <Label>{t('form:input-label-related-products')}</Label>
            <SelectInput
                name="related_products"
                isMulti
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                value={useWatch({ control, name: 'related_products' })}
                // @ts-ignore
                options={products}
                onChange={(value: any) => {
                    setValue('related_products', value);
                    // can select only 5 products
                    if (value.length > 5) {
                        setValue('related_products', value.slice(0, 5));
                    }
                }
                }
            // isLoading={loading}
            />
        </div>
    );
};

export default RelatedProductInput;
