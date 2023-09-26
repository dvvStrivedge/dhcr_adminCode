import * as yup from 'yup';
export const includeValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
