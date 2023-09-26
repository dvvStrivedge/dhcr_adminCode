import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from './product-validation-schema';
import ProductSimpleForm from './product-simple-form';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import { ProductType, Product } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { use, useEffect, useState } from 'react';
import { EditIcon } from '@/components/icons/edit';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join, values } from 'lodash';
import { CKEditor } from 'ckeditor4-react';

import Select from 'react-select';
import { useCategoriesQuery } from '@/data/category';
import { useTagsQuery } from '@/data/tag';
import RelatedProductInput from './related-product-input';

type ProductFormProps = {
  initialValues?: Product | null;
};

export default function CreateOrUpdateProductForm({
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const [value, setValues] = useState(initialValues?.technical_specs_description);
  const [categoryValue, setCategoryValues] = useState();
  const [relatedProductsValue, setrelatedProductsValues] = useState();
  const [tagValue, setTagValues] = useState();
  // const { data: shopData } = useShopQuery(
  //   { slug: router.query.shop as string },
  //   {
  //     enabled: !!router.query.shop,
  //   }
  // );

  // const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: getProductDefaultValues(initialValues!, isNewTranslation),
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;


  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();
  const { locale } = useRouter();
  const { categories } = useCategoriesQuery({
    limit: 999,
    language: locale,
  });

  const { tags } = useTagsQuery({
    limit: 999,
    language: locale,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    let list: any = [];
    let list1: any = [];
    let categoryList: any = [];
    let relatedProductsList: any = [];
    let tagList: any = [];
    if (categories) {
      list = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
    }
    setCategoryOptions(list);

    if (tags) {
      list1 = tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));
    }
    setTagOptions(list1);

    if (initialValues?.categories?.length) {
      categoryList = initialValues?.categories?.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setCategoryValues(categoryList);
    }

    if (initialValues?.related_products?.length) {
      relatedProductsList = initialValues?.related_products?.map((relatedProduct) => ({
        value: relatedProduct.id,
        label: relatedProduct.name,
      }));
      setrelatedProductsValues(relatedProductsList);
    }

    if (initialValues?.tags?.length) {
      categoryList = initialValues?.tags?.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));
      setTagValues(categoryList);
    }
    if (control._fields.related_products?._f?.value?.length > 5) {
      setErrorMessage("You can add only 5 related products");
    }
  }, [categories, tags, initialValues, control._fields.related_products?._f?.value?.length]);

  const onSubmit = async (values: ProductFormValues) => {
    if (values.gallery?.length) {
      let featuredImage = values.gallery.find((image: any) => image.featured === true);
      values.image = featuredImage;
    }

    // if (values.categories === undefined || values.categories === null || values.categories.length === 0) {
    //   values.categories = initialValues?.categories
    // }

    // if (values.tags === undefined || values.tags === null || values.tags.length === 0) {
    //   values.tags = initialValues?.tags
    // }

    const inputValues = {
      language: router.locale,
      ...getProductInputValues(values, initialValues, isNewTranslation),
    };

    try {
      if (inputValues.includes.length === 0) {
        inputValues.includes = "";
      }
      if (inputValues.pickup_locations.length === 0) {
        inputValues.pickup_locations = "";
      }

      // if (values?.categories?.length) {
      //   values.categories = values.categories.map((category) =>
      //     category?.value ? category?.value : category?.id);
      // }
      // if (values?.tags?.length) {
      //   values.tags = values.tags.map((tag) =>
      //     tag?.value ? tag?.value : tag?.id);
      // }
      // if (inputValues.technical_specs_description === undefined || inputValues.technical_specs_description === null || inputValues.technical_specs_description === "") {
      //   inputValues.technical_specs_description = value;
      // }

      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        //@ts-ignore
        createProduct({
          ...inputValues,
          ...(initialValues?.slug && { slug: initialValues.slug }),
          // categories: values.categories,
          // tags: values.tags,
          // shop_id: shopId || initialValues?.shop_id,
        });
      } else {
        //@ts-ignore
        updateProduct({
          ...inputValues,
          id: initialValues.id!,
          // categories: values.categories,
          // tags: values.tags,
          // shop_id: initialValues.shop_id!,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };
  const product_type = watch('product_type');
  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const slugAutoSuggest = join(split(watch('name'), ' '), '-').toLowerCase();

  const handleEditorChange = (e: any) => {
    setValue('technical_specs_description', e);
  };
  const handleChangeCat = (name: any, value: any) => {
    console.log("name", name, value);
    setValue('categories', name);
    setCategoryValues(name);
  };

  // const handleChangeTag = (name: any, value: any) => {
  //   console.log("name", name, value);
  //   setValue('tags', name);
  //   setTagValues(name);
  // };

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:featured-image-title')}
              details={t('form:featured-image-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} />
            </Card>
          </div> */}

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:gallery-title')}
              details={t('form:gallery-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="gallery" control={control} />
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:type-and-category')}
              details={t('form:type-and-category-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              {/* <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
              /> */}
              {/* <div className="mb-5">
                <Label>{t('form:input-label-categories')}</Label>
                <Select
                  name="categories"
                  className={`react-select`}
                  classNamePrefix="react-select"
                  options={categoryOptions}
                  placeholder='Select Categories'
                  isMulti={true}
                  value={categoryValue}
                  onChange={(name, value) => handleChangeCat(name, value)}
                  // isClearable={true}
                  closeMenuOnSelect={true}
                />
              </div> */}
              <ProductCategoryInput control={control} setValue={setValue} />
              <RelatedProductInput control={control} setValue={setValue} />

              {/* <ProductAuthorInput control={control} /> */}
              {/* <ProductManufacturerInput control={control} setValue={setValue} /> */}
              {/* <ProductTagInput control={control} setValue={setValue} /> */}
              {/* <div className="mb-5">
                <Label>{t('form:input-label-categories')}</Label>
                <Select
                  name="categories"
                  className={`react-select`}
                  classNamePrefix="react-select"
                  options={tagOptions}
                  placeholder='Select Tags'
                  isMulti={true}
                  value={tagValue}
                  onChange={(name, value) => handleChangeTag(name, value)}
                  // isClearable={true}
                  closeMenuOnSelect={true}
                />
              </div> */}
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:item-description')}
              details={`${initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
                } ${t('form:product-description-help-text')}`}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t('form:input-label-name')}*`}
                {...register('name')}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />

              {isSlugEditable ? (
                <div className="relative mb-5">
                  <Input
                    label={`${t('Slug')}`}
                    {...register('slug')}
                    error={t(errors.slug?.message!)}
                    variant="outline"
                    disabled={isSlugDisable}
                  />
                  <button
                    className="absolute top-[27px] right-px z-10 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                    type="button"
                    title={t('common:text-edit')}
                    onClick={() => setIsSlugDisable(false)}
                  >
                    <EditIcon width={14} />
                  </button>
                </div>
              ) : (
                <Input
                  label={`${t('Slug')}`}
                  {...register('slug')}
                  value={slugAutoSuggest}
                  variant="outline"
                  className="mb-5"
                  disabled
                />
              )}
              <Input
                label={`${t('form:input-label-unit')}*`}
                {...register('unit')}
                error={t(errors.unit?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t('form:input-label-description')}
                {...register('description')}
                error={t(errors.description?.message!)}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t('form:input-label-location')}`}
                {...register('pickup_locations')}
                error={t(errors.pickup_locations?.message!)}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t('form:input-label-include')}`}
                {...register('includes')}
                error={t(errors.includes?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t('form:input-label-feature1')}
                {...register('feature_1')}
                error={t(errors.feature_1?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t('form:input-label-feature2')}
                {...register('feature_2')}
                error={t(errors.feature_2?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t('form:input-label-feature3')}
                {...register('feature_3')}
                error={t(errors.feature_3?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t('form:input-label-feature4')}
                {...register('feature_4')}
                error={t(errors.feature_4?.message!)}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t('form:input-label-technicalSpecsName')}`}
                {...register('technical_specs_name')}
                error={t(errors.technical_specs_name?.message!)}
                variant="outline"
                className="mb-5"
              />

              {/* <TextArea
                label={t('form:input-label-technicalSpecsDesc')}
                {...register('technical_specs_description')}
                error={t(errors.technical_specs_description?.message!)}
                variant="outline"
                className="mb-5"
              /> */}
              <Label>{t('form:input-label-technicalSpecsDesc')}</Label>
              <CKEditor
                name='technical_specs_description'
                config={{
                  toolbar: [
                    { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
                    { name: 'clipboard', items: ['Undo', 'Redo'] },
                    { name: 'insert', items: ['Image', 'Table'] },
                    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'colors', items: ['TextColor', 'BGColor'] }
                  ],
                  placeHolder: "type Something...",
                  styleSet: { name: 'technical_specs_description', element: 'em', styles: { whiteSpace: 'normal' } }
                }}
                debug={false}
                initData={value}
                // data={value}
                onChange={(evt) => handleEditorChange(evt.editor.getData())}
              />

              <div className='mt-4'>
                <Label>{t('form:input-label-status')}</Label>
                <Radio
                  {...register('status')}
                  label={t('form:input-label-published')}
                  id="published"
                  value="publish"
                  className="mb-2"
                />
                <Radio
                  {...register('status')}
                  id="draft"
                  label={t('form:input-label-draft')}
                  value="draft"
                />
              </div>
            </Card>
          </div>

          {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-title-product-type')}
              details={t('form:form-description-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
            />

						<ProductTypeInput />
					</div> */}

          <ProductSimpleForm initialValues={initialValues} />

          {/* Simple Type */}
          {/* {product_type?.value === ProductType.Simple && (
          )} */}

          {/* Variation Type */}
          {/* {product_type?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
            />
          )} */}

          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t('form:button-label-update-product')
                : t('form:button-label-add-product')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
