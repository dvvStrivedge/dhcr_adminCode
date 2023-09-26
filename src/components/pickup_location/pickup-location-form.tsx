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
import ValidationError from '@/components/ui/form-validation-error';
import { tagIcons } from './tag-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { pickupLocationValidationSchema } from './pickup-location-validation-schema';
import { useCreatePickupLocationMutation, useUpdatePickupLocationMutation } from '@/data/pickupLocation';

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
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  land_mark: string;
};

const defaultValues = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  land_mark: '',
};

type IProps = {
  initialValues?: any;
};
export default function CreateOrUpdatePickupLocationForm({ initialValues }: IProps) {
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

    resolver: yupResolver(pickupLocationValidationSchema),
  });

  const { mutate: createPickupLocation, isLoading: creating } = useCreatePickupLocationMutation();
  const { mutate: updatePickupLocation, isLoading: updating } = useUpdatePickupLocationMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      language: router.locale,
      name: values.name,
      address: values.address,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      country: values.country,
      land_mark: values.land_mark,
      // type_id: values.type?.id,
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale)
      ) {
        createPickupLocation({
          ...input,
          ...(initialValues?.slug && { slug: initialValues.slug }),
        });
      } else {
        updatePickupLocation({
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
          details={t('form:location-image-helper-text')}
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
            } ${t('form:location-description-helper-text')}`}
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
            label={t('form:input-label-address')}
            {...register('address')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-city')}
            {...register('city')}
            error={t(errors.city?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-state')}
            {...register('state')}
            error={t(errors.state?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-pincode')}
            {...register('pincode')}
            error={t(errors.pincode?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-country')}
            {...register('country')}
            error={t(errors.country?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-landmark')}
            {...register('land_mark')}
            error={t(errors.land_mark?.message!)}
            variant="outline"
            className="mb-5"
          />

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
            ? t('form:button-label-update-location')
            : t('form:button-label-add-location')}
        </Button>
      </div>
    </form>
  );
}
