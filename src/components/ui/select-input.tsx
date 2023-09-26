import Select from '@/components/ui/select/select';
import { Controller } from 'react-hook-form';

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: any;
  getOptionValue?: any;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  [key: string]: unknown;
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  value,
  ...rest
}: SelectInputProps) => {

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field }) => (
        <Select
          {...field}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          isClearable={isClearable}
          isLoading={isLoading}
          options={options}
          value={value}
          isDisabled={disabled as boolean}
          isOptionDisabled={() => value?.length >= 5}
        />
      )}
    />
  );
};

export default SelectInput;
