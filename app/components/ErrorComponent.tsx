import * as React from "react";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type ErrorCardProps = {
  errorMessage: string | undefined;
};

export const ErrorCard: React.FC<ErrorCardProps> = ({ errorMessage }) => {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} color="red">
      {errorMessage}
    </Alert>
  );
};
