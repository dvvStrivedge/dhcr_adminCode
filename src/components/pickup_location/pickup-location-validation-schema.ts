import * as yup from 'yup';
export const pickupLocationValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
