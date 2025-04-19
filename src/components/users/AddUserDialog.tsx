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
    onSubmit(data);
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
          <Dialog.Content>
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
                          label="Name"
                          required
                          error={errors.name?.message}
                          startElement={<UserIcon size={16} />}
                          orientation={{
                            base: "vertical",
                            md: "horizontal",
                          }}
                          {...register("name")}
                        />

                        <InputField
                          label="Username"
                          required
                          error={errors.username?.message}
                          startElement={<AtSign size={16} />}
                          orientation={{
                            base: "vertical",
                            md: "horizontal",
                          }}
                          {...register("username")}
                        />

                        <InputField
                          label="Email"
                          required
                          error={errors.email?.message}
                          startElement={<MailIcon size={16} />}
                          orientation={{
                            base: "vertical",
                            md: "horizontal",
                          }}
                          {...register("email")}
                        />

                        <InputField
                          label="Phone"
                          error={errors.phone?.message}
                          startElement={<PhoneIcon size={16} />}
                          orientation={{
                            base: "vertical",
                            md: "horizontal",
                          }}
                          {...register("phone")}
                        />

                        <InputField
                          label="Website"
                          error={errors.website?.message}
                          startElement={<GlobeIcon size={16} />}
                          orientation={{
                            base: "vertical",
                            md: "horizontal",
                          }}
                          {...register("website")}
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
                            label="Street"
                            required
                            gridColumn={{
                              base: "span 1",
                              md: "span 2",
                            }}
                            error={errors.address?.street?.message}
                            {...register("address.street")}
                          />

                          <InputField
                            label="Suite"
                            required
                            error={errors.address?.suite?.message}
                            {...register("address.suite")}
                          />

                          <InputField
                            label="City"
                            required
                            error={errors.address?.city?.message}
                            {...register("address.city")}
                          />

                          <InputField
                            label="Zipcode"
                            required
                            error={errors.address?.zipcode?.message}
                            {...register("address.zipcode")}
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
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button type="submit" form="add-user-form" colorPalette="green">
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
