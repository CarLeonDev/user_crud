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
} from "@chakra-ui/react";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  UserXIcon,
  ArrowLeftIcon,
} from "lucide-react";

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
          <Grid
            w="full"
            templateRows={{
              base: "repeat(auto-fit, minmax(0, 1fr))",
              md: "repeat(2, 1fr)",
            }}
            gap={4}
            alignItems="center"
          >
            <Stack direction="column" gap={2}>
              <Field.Root
                orientation={{
                  base: "vertical",
                  md: "horizontal",
                }}
              >
                <Field.Label gap={2}>
                  <MailIcon size={16} /> Email:
                </Field.Label>

                <Input value={data?.email} disabled />
              </Field.Root>

              <Field.Root
                orientation={{
                  base: "vertical",
                  md: "horizontal",
                }}
              >
                <Field.Label gap={2}>
                  <PhoneIcon size={16} /> Phone:
                </Field.Label>

                <Input value={data?.phone} disabled />
              </Field.Root>

              <Field.Root
                orientation={{
                  base: "vertical",
                  md: "horizontal",
                }}
              >
                <Field.Label gap={2}>
                  <GlobeIcon size={16} /> Website:
                </Field.Label>

                <Input value={data?.website} disabled />
              </Field.Root>
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
                <Field.Root
                  gridColumn={{
                    md: "span 2",
                    base: "span 1",
                  }}
                >
                  <Field.Label gap={2}>Street</Field.Label>

                  <Input value={data?.address?.street} disabled />
                </Field.Root>

                <Field.Root gridColumn="span 1">
                  <Field.Label gap={2}>Suite</Field.Label>

                  <Input value={data?.address?.suite} disabled />
                </Field.Root>

                <Field.Root gridColumn="span 1">
                  <Field.Label gap={2}>City</Field.Label>

                  <Input value={data?.address?.city} disabled />
                </Field.Root>

                <Field.Root gridColumn="span 1">
                  <Field.Label gap={2}>ZipCode</Field.Label>

                  <Input value={data?.address?.zipcode} disabled />
                </Field.Root>
              </Grid>
            </Stack>
          </Grid>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
