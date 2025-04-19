import { Alert, Blockquote } from "@chakra-ui/react";
import { TEST_IDS } from "@/constants";

type ErrorAlertProps = {
  error: Error | null;
  title: string;
  description?: string;
};

export const ErrorAlert = ({ error, title, description }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert.Root
      status="error"
      variant="subtle"
      mb={4}
      data-testid={TEST_IDS.ERROR_ALERT}
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>
          <p>{description}</p>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
          <Blockquote.Root>
            <Blockquote.Content>{error.message}</Blockquote.Content>
          </Blockquote.Root>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};
