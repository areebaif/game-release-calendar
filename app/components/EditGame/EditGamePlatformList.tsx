import * as React from "react";
import { Grid, Title, Button, Input, Divider } from "@mantine/core";
import { FormPlatformFields, EditGameFormFields } from "~/utils/types";
import { formatDate } from "~/utils";

export type EditGamePlatformListProps = {
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (data: FormPlatformFields[]) => void;
};

export const EditGamePlatformList: React.FC<EditGamePlatformListProps> = ({
  formPlatformFields,
  setFormPlatformFields,
}) => {
  const onRemoveField = (id: string) => {
    setFormPlatformFields(
      formPlatformFields.filter((fields) => fields.platformId !== id)
    );
  };
  return (
    <>
      {formPlatformFields.length ? (
        <>
          <Divider my="sm" />
          <Grid>
            <Grid.Col span={"auto"}>
              <Title order={5}>Platform Name</Title>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              {" "}
              <Title order={5}>Release Date</Title>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              {" "}
              <Title order={5}>Delete</Title>
            </Grid.Col>
          </Grid>
          {formPlatformFields.map((formValues, index) => (
            <React.Fragment key={index}>
              <Input
                variant="unstyled"
                value={`${formValues.platformId}$${formValues.platformName}$${formValues.releaseDate}`}
                type="hidden"
                name={`${EditGameFormFields.platformIdNameReleaseDate}`}
                readOnly
              ></Input>
              <Divider my="sm" />
              <Grid>
                <Grid.Col span={"auto"}>
                  <Input
                    variant="unstyled"
                    value={formValues.platformName}
                    readOnly
                  ></Input>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Input
                    variant="unstyled"
                    value={formatDate(formValues.releaseDate)}
                    readOnly
                  ></Input>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onRemoveField(formValues.platformId);
                    }}
                  >
                    Delete
                  </Button>
                </Grid.Col>
              </Grid>
            </React.Fragment>
          ))}
        </>
      ) : (
        <> </>
      )}
    </>
  );
};
