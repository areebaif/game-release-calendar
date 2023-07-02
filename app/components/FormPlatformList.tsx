import * as React from "react";
import {
  Table,
  Grid,
  Title,
  Button,
  TextInput,
  Input,
  Divider,
} from "@mantine/core";
import { FormPlatformFields, PlatformDropDwonList } from "~/utils/types";
import { formatDate } from "~/utils";

type FormPlatformListProps = {
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (data: FormPlatformFields[]) => void;
  setPlatformDropdownList: (data: PlatformDropDwonList[]) => void;
  platformDropdownList: PlatformDropDwonList[];
  dropdownList: PlatformDropDwonList[];
};

export const FormPlatformList: React.FC<FormPlatformListProps> = ({
  formPlatformFields,
  setFormPlatformFields,
  setPlatformDropdownList,
  platformDropdownList,
  dropdownList,
}) => {
  const onRemoveField = (id: number) => {
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
              <Title order={5}>Id</Title>
            </Grid.Col>
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
            <>
              <Divider my="sm" />
              <Grid key={index}>
                <Grid.Col span={"auto"}>
                  <Input
                    variant="unstyled"
                    value={formValues.platformId}
                    type="text"
                    name="platformId"
                    readOnly
                  ></Input>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Input
                    variant="unstyled"
                    value={formValues.platformName}
                    type="text"
                    name="platformName"
                    readOnly
                  ></Input>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Input
                    variant="unstyled"
                    value={formatDate(formValues.releaseDate)}
                    type="text"
                    name="releaseDate"
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
            </>
          ))}
        </>
      ) : (
        <> </>
      )}
    </>
  );
};