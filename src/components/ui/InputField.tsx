import {
  FieldRootProps,
  Input,
  InputProps,
  InputGroup,
  Stack,
  Field,
} from "@chakra-ui/react";

type InputFieldProps = {
  name?: string;
  label: string;
  error?: string;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
} & FieldRootProps &
  InputProps;

export const InputField = ({
  name,
  label,
  required,
  error,
  startElement,
  endElement,
  orientation,
  ...props
}: InputFieldProps) => {
  return (
    <Field.Root
      required={required}
      invalid={!!error}
      orientation={orientation}
      {...props}
    >
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>

      <Stack direction="column" gap={1} w="full">
        <InputGroup startElement={startElement} endElement={endElement}>
          <Input name={name} {...props} />
        </InputGroup>

        <Field.ErrorText>{error}</Field.ErrorText>
      </Stack>
    </Field.Root>
  );
};
