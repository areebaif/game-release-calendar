import * as React from "react";
import { Grid, Title, Button, Input, Divider } from "@mantine/core";
import { FormPlatformFields, AddGameFormFields } from "~/utils/types";
import { formatDate } from "~/utils";

export type GameSpecificPlatformListProps = {
  gamePlatformList: FormPlatformFields[];
  setGamePlatformList: (data: FormPlatformFields[]) => void;
};

export const GameSpecificPlatformList: React.FC<
  GameSpecificPlatformListProps
> = ({ gamePlatformList, setGamePlatformList }) => {
  const onRemoveField = (id: string) => {
    setGamePlatformList(
      gamePlatformList.filter((fields) => fields.platformId !== id)
    );
  };
  return (
    <>
      {gamePlatformList.length ? (
        <>
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
          <Divider my="sm" />
          {gamePlatformList.map((formValues, index) => (
            <React.Fragment key={formValues.platformId}>
              <Input
                variant="unstyled"
                value={`${formValues.platformId}$${formValues.platformName}$${formValues.releaseDate}`}
                type="hidden"
                //name={`${AddGameFormFields.platformIdNameReleaseDate}`}
                readOnly
              ></Input>

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
              <Divider my="sm" />
            </React.Fragment>
          ))}
        </>
      ) : (
        <> </>
      )}
    </>
  );
};
