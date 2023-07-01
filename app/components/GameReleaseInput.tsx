import * as React from "react";
import { Flex, Select, Box, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";

export const GamePlatformInput: React.FC = () => {
  return (
    <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
      <Select
        //value={selectPlotIdVal}
        //onChange={setSelectPlotIdVal}
        label="platform"
        withAsterisk
        placeholder="pick one"
        nothingFound="No options"
        data={["test", "TestTwo"]}
      />
      <DateInput
        //inputFormat="ddd MMM D YYYY"
        label={"select date"}
        placeholder={"dd/mm/yyyy"}
        withAsterisk
        //error={!sellDate}
        //value={sellDate}
        //onChange={setSellDate}
      />
      <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
        <Button
          variant="outline"
          onClick={() => {
            //handleAddPlot();
          }}
        >
          Add
        </Button>
      </Box>
    </Flex>
  );
};
