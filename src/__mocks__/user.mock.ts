import { User } from "@/types/users";

export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  username: "johndoe",
  phone: "123-456-7890",
  address: {
    street: "123 Main St",
    suite: "Apt 4B",
    city: "New York",
    zipcode: "10001",
    geo: {
      lat: "40.7128",
      lng: "-74.0060",
    },
  },
  website: "https://example.com",
  company: {
    name: "Example Corp",
    catchPhrase: "Making things better",
    bs: "Enterprise solutions",
  },
};
