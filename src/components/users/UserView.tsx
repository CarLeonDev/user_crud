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
  Blockquote,
  Alert,
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
export const UserView = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id as string),
  });

  const { usersAdded } = useUsersStore();

  const userData = !data?.id ? usersAdded.find((user) => user.id === id) : data;

  if (isLoading) return <Loading />;

  if (error) return <ErrorAlert error={error} title="Unable to Load User" />;

  if (!userData?.id) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
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
              <Heading>{userData?.name}</Heading>
              <Text fontSize="sm" color="fg.muted">
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
                    label="Email"
                    value={userData?.email}
                    startElement={<MailIcon size={16} />}
                    orientation={{
                      base: "vertical",
                      md: "horizontal",
                    }}
                  />

                  <InputField
                    label="Phone"
                    value={userData?.phone}
                    startElement={<PhoneIcon size={16} />}
                    orientation={{
                      base: "vertical",
                      md: "horizontal",
                    }}
                  />

                  <InputField
                    label="Website"
                    value={userData?.website}
                    startElement={<GlobeIcon size={16} />}
                    orientation={{
                      base: "vertical",
                      md: "horizontal",
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
                      gridColumn={{
                        md: "span 2",
                        base: "span 1",
                      }}
                      label="Street"
                      value={userData?.address?.street}
                    />

                    <InputField
                      label="Suite"
                      value={userData?.address?.suite}
                    />

                    <InputField label="City" value={userData?.address?.city} />

                    <InputField
                      label="ZipCode"
                      value={userData?.address?.zipcode}
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
