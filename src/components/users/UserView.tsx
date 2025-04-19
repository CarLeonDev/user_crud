"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/usersService";
import { Loading } from "../ui/Loading";
import {
  Avatar,
  Card,
  Grid,
  Heading,
  Stack,
  Separator,
  Button,
  EmptyState,
  Flex,
  Fieldset,
  Text,
} from "@chakra-ui/react";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  UserXIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { useUsersStore } from "@/stores/useUsersStore";
import { ErrorAlert } from "@/components/ErrorAlert";
import { TEST_IDS } from "@/constants";

export const UserView = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id as string),
  });

  const { usersAdded } = useUsersStore();

  const userData = !data?.id ? usersAdded.find((user) => user.id === id) : data;

  if (isLoading) return <Loading data-testid={TEST_IDS.LOADING_SPINNER} />;

  if (error) return <ErrorAlert error={error} title="Unable to Load User" />;

  if (!userData?.id) {
    return (
      <EmptyState.Root>
        <EmptyState.Content data-testid={TEST_IDS.EMPTY_STATE_CONTENT}>
          <EmptyState.Indicator>
            <UserXIcon size={24} />
          </EmptyState.Indicator>

          <EmptyState.Title>User not found</EmptyState.Title>

          <EmptyState.Description
            gap={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            The user you are looking for does not exist.
            <Button size="xs" variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon size={16} />
              Go back
            </Button>
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <Stack direction="row" justifyContent="center">
      <Card.Root flex={1} w="full" maxW="2xl">
        <Card.Header>
          <Stack direction="row" gap={2} alignItems="center">
            <Avatar.Root variant="solid">
              <Avatar.Fallback name={userData?.name} />
            </Avatar.Root>

            <Stack direction="column" gap={0}>
              <Heading data-testid={TEST_IDS.USER_NAME}>{userData?.name}</Heading>
              <Text fontSize="sm" color="fg.muted" data-testid={TEST_IDS.USER_USERNAME}>
                @{userData?.username}
              </Text>
            </Stack>
          </Stack>
        </Card.Header>

        <Card.Body>
          <Fieldset.Root size="lg" disabled>
            <Fieldset.Content>
              <Flex direction="column" gap={4}>
                <Stack direction="column" gap={2}>
                  <InputField
                    name="email"
                    label="Email"
                    fieldRootProps={{
                      orientation: {
                        base: "vertical",
                        md: "horizontal",
                      },
                    }}
                    inputProps={{
                      value: userData?.email,
                    }}
                    inputGroupProps={{
                      startElement: <MailIcon size={16} />,
                    }}
                  />

                  <InputField
                    name="phone"
                    label="Phone"
                    fieldRootProps={{
                      orientation: {
                        base: "vertical",
                        md: "horizontal",
                      },
                    }}
                    inputProps={{
                      value: userData?.phone,
                    }}
                    inputGroupProps={{
                      startElement: <PhoneIcon size={16} />,
                    }}
                  />

                  <InputField
                    name="website"
                    label="Website"
                    fieldRootProps={{
                      orientation: {
                        base: "vertical",
                        md: "horizontal",
                      },
                    }}
                    inputProps={{
                      value: userData?.website,
                    }}
                    inputGroupProps={{
                      startElement: <GlobeIcon size={16} />,
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
                      fieldRootProps={{
                        gridColumn: {
                          md: "span 2",
                          base: "span 1",
                        },
                      }}
                      inputProps={{
                        value: userData?.address?.street,
                      }}
                      inputGroupProps={{
                        startElement: <MapPinIcon size={16} />,
                      }}
                    />

                    <InputField
                      name="address.suite"
                      label="Suite"
                      inputProps={{
                        value: userData?.address?.suite,
                      }}
                    />

                    <InputField
                      name="address.city"
                      label="City"
                      inputProps={{
                        value: userData?.address?.city,
                      }}
                    />

                    <InputField
                      name="address.zipcode"
                      label="ZipCode"
                      inputProps={{
                        value: userData?.address?.zipcode,
                      }}
                    />
                  </Grid>
                </Stack>
              </Flex>
            </Fieldset.Content>
          </Fieldset.Root>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
