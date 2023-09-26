import * as yup from 'yup';
export const featureValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
