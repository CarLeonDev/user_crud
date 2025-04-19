import {
  Dialog,
  Button,
  CloseButton,
  Portal,
  Stack,
  Grid,
  Heading,
  Separator,
  Flex,
  Fieldset,
} from "@chakra-ui/react";
import {
  AtSign,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, UserSchema } from "@/schemas/userSchema";
import { InputField } from "@/components/ui/InputField";
import { TEST_IDS } from "@/constants";

interface AddUserDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: UserSchema) => void;
}

export const AddUserDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddUserDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    reValidateMode: "onBlur",
    resolver: yupResolver(userSchema),
  });

  const handleSubmitForm = (data: UserSchema) => {
    onSubmit({
      ...data,
      address: {
        ...data.address,
      },
    });
    reset();
  };

  return (
    <Dialog.Root
      lazyMount
      open={open}
      closeOnInteractOutside={false}
      onOpenChange={(e) => onOpenChange?.(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid={TEST_IDS.ADD_USER_DIALOG}>
            <Dialog.Header>
              <Dialog.Title>Create new user</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                id="add-user-form"
                onSubmit={handleSubmit(handleSubmitForm)}
              >
                <Fieldset.Root size="lg">
                  <Fieldset.Content>
                    <Flex direction="column" gap={4}>
                      <Stack direction="column" gap={2}>
                        <InputField
                          name="name"
                          label="Name"
                          required
                          error={errors.name?.message}
                          fieldRootProps={{
                            orientation: {
                              base: "vertical",
                              md: "horizontal",
                            },
                          }}
                          inputGroupProps={{
                            startElement: <UserIcon size={16} />,
                          }}
                          inputProps={{
                            ...register("name"),
                          }}
                        />

                        <InputField
                          name="username"
                          label="Username"
                          required
                          error={errors.username?.message}
                          fieldRootProps={{
                            orientation: {
                              base: "vertical",
                              md: "horizontal",
                            },
                          }}
                          inputGroupProps={{
                            startElement: <AtSign size={16} />,
                          }}
                          inputProps={{
                            ...register("username"),
                          }}
                        />

                        <InputField
                          name="email"
                          label="Email"
                          required
                          error={errors.email?.message}
                          fieldRootProps={{
                            orientation: {
                              base: "vertical",
                              md: "horizontal",
                            },
                          }}
                          inputGroupProps={{
                            startElement: <MailIcon size={16} />,
                          }}
                          inputProps={{
                            ...register("email"),
                          }}
                        />

                        <InputField
                          name="phone"
                          label="Phone"
                          error={errors.phone?.message}
                          fieldRootProps={{
                            orientation: {
                              base: "vertical",
                              md: "horizontal",
                            },
                          }}
                          inputGroupProps={{
                            startElement: <PhoneIcon size={16} />,
                          }}
                          inputProps={{
                            ...register("phone"),
                          }}
                        />

                        <InputField
                          name="website"
                          label="Website"
                          error={errors.website?.message}
                          fieldRootProps={{
                            orientation: {
                              base: "vertical",
                              md: "horizontal",
                            },
                          }}
                          inputGroupProps={{
                            startElement: <GlobeIcon size={16} />,
                          }}
                          inputProps={{
                            ...register("website"),
                          }}
                        />
                      </Stack>

                      <Stack direction="column" gap={2}>
                        <Stack direction="row" gap={2} alignItems="center">
                          <MapPinIcon size={16} />
                          <Heading size="md">Address</Heading>
                        </Stack>

                        <Separator />

                        <Grid
                          templateColumns={{
                            md: "repeat(auto-fit, minmax(200px, 1fr))",
                            base: "repeat(1, 1fr)",
                          }}
                          gap={2}
                        >
                          <InputField
                            name="address.street"
                            label="Street"
                            required
                            error={errors.address?.street?.message}
                            fieldRootProps={{
                              gridColumn: {
                                base: "span 1",
                                md: "span 2",
                              },
                            }}
                            inputGroupProps={{
                              startElement: <MapPinIcon size={16} />,
                            }}
                            inputProps={{
                              ...register("address.street"),
                            }}
                          />

                          <InputField
                            name="address.suite"
                            label="Suite"
                            required
                            error={errors.address?.suite?.message}
                            inputProps={{
                              ...register("address.suite"),
                            }}
                          />

                          <InputField
                            name="address.city"
                            label="City"
                            required
                            error={errors.address?.city?.message}
                            inputProps={{
                              ...register("address.city"),
                            }}
                          />

                          <InputField
                            name="address.zipcode"
                            label="Zipcode"
                            required
                            error={errors.address?.zipcode?.message}
                            inputProps={{
                              ...register("address.zipcode"),
                            }}
                          />
                        </Grid>
                      </Stack>
                    </Flex>
                  </Fieldset.Content>
                </Fieldset.Root>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  data-testid={TEST_IDS.ADD_USER_DIALOG_CANCEL_BUTTON}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              <Button
                type="submit"
                form="add-user-form"
                colorPalette="green"
                data-testid={TEST_IDS.ADD_USER_DIALOG_CREATE_BUTTON}
              >
                Create
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
