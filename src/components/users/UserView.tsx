"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/usersService";
import { Loading } from "../ui/Loading";
import {
  Avatar,
  Card,
  Field,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Separator,
  Button,
  EmptyState,
  Flex,
  Fieldset,
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
export const UserView = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id as string),
  });

  if (isLoading) return <Loading />;

  if (!data?.id) {
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
              <Avatar.Fallback name={data?.name} />
            </Avatar.Root>

            <Stack direction="column" gap={0}>
              <Heading>{data?.name}</Heading>
              <Text fontSize="sm" color="fg.muted">
                @{data?.username}
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
                    value={data?.email}
                    startElement={<MailIcon size={16} />}
                    orientation={{
                      base: "vertical",
                      md: "horizontal",
                    }}
                  />

                  <InputField
                    label="Phone"
                    value={data?.phone}
                    startElement={<PhoneIcon size={16} />}
                    orientation={{
                      base: "vertical",
                      md: "horizontal",
                    }}
                  />

                  <InputField
                    label="Website"
                    value={data?.website}
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
                      value={data?.address?.street}
                    />

                    <InputField label="Suite" value={data?.address?.suite} />

                    <InputField label="City" value={data?.address?.city} />

                    <InputField
                      label="ZipCode"
                      value={data?.address?.zipcode}
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
