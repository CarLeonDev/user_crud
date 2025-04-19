import { Box, BoxProps } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";

type LoadingProps = {
  size?: "sm" | "md" | "lg";
} & BoxProps;

const sizeProps = {
  sm: {
    w: 6,
    h: 6,
  },
  md: {
    w: 8,
    h: 8,
  },
  lg: {
    w: 10,
    h: 10,
  },
};

export const Loading = ({ size = "md", ...props }: LoadingProps) => {
  return (
    <Box
      animation="spin"
      alignItems="center"
      justifyContent="center"
      {...sizeProps[size]}
      {...props}
    >
      <Loader2 width="100%" height="100%" />
    </Box>
  );
};
