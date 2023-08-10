import * as React from "react";
import { Grid, Title, Button, Input, Divider } from "@mantine/core";
import { FormPlatformFields, PlatformDropDwonList } from "~/utils/types";
import { formatDate, AddGameFormFields } from "~/utils";

export type PlatformListProps = {
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (data: FormPlatformFields[]) => void;
  setPlatformDropdownList: (data: PlatformDropDwonList[]) => void;
  platformDropdownList: PlatformDropDwonList[];
  dropdownList: PlatformDropDwonList[];
};

export const PlatformList: React.FC<PlatformListProps> = ({
  formPlatformFields,
  setFormPlatformFields,
  setPlatformDropdownList,
  platformDropdownList,
  dropdownList,
}) => {
  const onRemoveField = (id: string) => {
    setFormPlatformFields(
      formPlatformFields.filter((fields) => fields.platformId !== id)
    );
    const valueToAdd = dropdownList.filter((item) => item.id === id);
    // add fields back to your select input
    setPlatformDropdownList([...platformDropdownList, ...valueToAdd]);
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
            <React.Fragment key={formValues.platformId}>
              <Input
                variant="unstyled"
                value={`${formValues.platformId}$${formValues.platformName}$${formValues.releaseDate}`}
                type="hidden"
                name={`${AddGameFormFields.platformIdNameReleaseDate}`}
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
