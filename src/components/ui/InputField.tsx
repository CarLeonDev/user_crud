import {
  FieldRootProps,
  Input,
  InputProps,
  InputGroup,
  Stack,
  Field,
  InputGroupProps,
} from "@chakra-ui/react";
import { TEST_IDS } from "@/constants";
import { RefAttributes } from "react";

type InputFieldProps = {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  fieldRootProps?: Omit<
    FieldRootProps & RefAttributes<HTMLDivElement>,
    "required" | "invalid" | "children"
  >;
  inputGroupProps?: Omit<
    InputGroupProps & RefAttributes<HTMLDivElement>,
    "children"
  >;
  inputProps?: InputProps & RefAttributes<HTMLInputElement>;
};

export const InputField = ({
  name,
  label,
  required,
  error,
  fieldRootProps,
  inputGroupProps,
  inputProps,
}: InputFieldProps) => {
  return (
    <Field.Root required={required} invalid={!!error} {...fieldRootProps}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>

      <Stack direction="column" gap={1} w="full">
        <InputGroup {...inputGroupProps}>
          <Input
            name={name}
            {...inputProps}
            data-testid={`${TEST_IDS.INPUT_FIELD}-${name}`}
          />
        </InputGroup>

        <Field.ErrorText>{error}</Field.ErrorText>
      </Stack>
    </Field.Root>
  );
};
