import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import * as categoriesIcon from '@/components/icons/category';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import { getErrorMessage } from '@/utils/form-error';
import { tagIcons } from './tag-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { includeValidationSchema } from './include-validation-schema';
import { useCreateTagMutation, useUpdateTagMutation } from '@/data/tag';
import { useCreateIncludeMutation, useUpdateIncludeMutation } from '@/data/include';

export const updatedIcons = tagIcons.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex h-5 w-5 items-center justify-center">
        {getIcon({
          iconList: categoriesIcon,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  details: string;
  image: any;
  icon: any;
};

const defaultValues = {
  image: '',
  name: '',
  details: '',
  icon: '',
};

type IProps = {
  initialValues?: any;
};
export default function CreateOrUpdateIncludeForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
        icon: initialValues?.icon
          ? tagIcons.find(
            (singleIcon) => singleIcon.value === initialValues?.icon!
          )
          : '',
        ...(isNewTranslation && {
          type: null,
        }),
      }
      : defaultValues,

    resolver: yupResolver(includeValidationSchema),
  });

  const { mutate: createInclude, isLoading: creating } = useCreateIncludeMutation();
  const { mutate: updateInclude, isLoading: updating } = useUpdateIncludeMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      language: router.locale,
      name: values.name,
      details: values.details,
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      icon: values.icon?.value ?? '',
      // type_id: values.type?.id,
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale)
      ) {
        createInclude({
          ...input,
          ...(initialValues?.slug && { slug: initialValues.slug }),
        });
      } else {
        updateInclude({
          ...input,
          id: initialValues.id!,
        });
      }
    } catch (err) {
      getErrorMessage(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:include-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${initialValues
            ? t('form:item-description-edit')
            : t('form:item-description-add')
            } ${t('form:include-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t('form:input-label-details')}
            {...register('details')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
        </Card>
      </div>
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

        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update-include')
            : t('form:button-label-add-include')}
        </Button>
      </div>
    </form>
  );
}
