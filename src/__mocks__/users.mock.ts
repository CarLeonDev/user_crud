import { User } from "@/types/users";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    username: "john_doe",
    email: "john@example.com",
    address: {
      street: "123 Main St",
      suite: "Apt 1",
      city: "Anytown",
      zipcode: "12345",
      geo: {
        lat: "40.7128",
        lng: "-74.0060",
      },
    },
    company: {
      name: "Example Inc",
      catchPhrase: "Innovating for a better tomorrow",
      bs: "We build innovative solutions for a better tomorrow",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "jane_smith",
    email: "jane@example.com",
    address: {
      street: "456 Elm St",
      suite: "Apt 2",
      city: "Anytown",
      zipcode: "12345",
      geo: {
        lat: "40.7128",
        lng: "-74.0060",
      },
    },
    company: {
      name: "Example Inc",
      catchPhrase: "Innovating for a better tomorrow",
      bs: "We build innovative solutions for a better tomorrow",
    },
  },
];
