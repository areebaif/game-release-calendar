import * as React from "react";
import { Flex, Chip, Group } from "@mantine/core";

interface selectBadgeDataInterface {
  id: string;
  name: string;
}

type SelectBadgesProps = {
  data: selectBadgeDataInterface[];
  selectedValues: string[] | undefined;
  name: string;
  onChangeSelectedValues: (val: string[] | undefined) => void;
};

export const SelectBadges: React.FC<SelectBadgesProps> = (props) => {
  const { selectedValues, data, onChangeSelectedValues, name } = props;
  return (
    <Flex direction={"column"} gap="xs" wrap="wrap">
      <label
        style={{
          display: "inline-block",
          fontSize: "0.875rem",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {name}
      </label>
      <Chip.Group
        multiple
        value={selectedValues}
        onChange={onChangeSelectedValues}
      >
        <Group>
          {data.map((T) => (
            <Chip key={T.id} value={`${T.id}`}>
              {T.name}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Flex>
  );
};
