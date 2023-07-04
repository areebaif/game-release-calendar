import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Card, Button, Loader } from "@mantine/core";
// local imports
import { AddPlatform, FormPlatformList, ErrorCard } from "~/components";
import { db } from "~/utils";
// type imports
import {
  GamePlatform,
  FormPlatformFields,
  AddGameFormFields,
  ErrorFormFields,
} from "~/utils/types";
import { GamePlatformZod } from "~/utils/zod";

export const loader = async () => {
  const platforms = await db.gamePlatform.findMany({
    select: { id: true, name: true },
  });
  return platforms;
};

export const action = async ({ request }: ActionArgs) => {
  console.log(
    " I am here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  const form = await request.formData();
  for (const pair of form.entries()) {
    console.log(pair, "hahahah");
  }

  return redirect(`/`);
};

const AddGame: React.FC = () => {
  // hooks
  const platforms = useLoaderData<GamePlatform[]>();
  //const navigation = useNavigation();
  const submit = useSubmit();
  // derive props
  const dropdownList = platforms.map((item) => ({
    ...item,
    value: `${item.id}`,
    label: item.name,
  }));
  const [platformDropdownList, setPlatformDropdownList] =
    React.useState(dropdownList);

  const [formPlatformFields, setFormPlatformFields] = React.useState<
    FormPlatformFields[]
  >([]);
  const [error, setError] = React.useState<ErrorFormFields>({
    isError: false,
    message: "",
    field: "",
  });
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);

  if (!parsePlatform.success) {
    console.log(parsePlatform.error);
    return (
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          overflow: "inherit",
          margin: "15px 0 0 0",
        }}
      >
        <ErrorCard
          errorMessage={"something went wrong with the server please try again"}
        />
      </Card>
    );
  }

  // if (navigation.state === "submitting" || navigation.state === "loading") {
  //   return <Loader />;
  // }
  const handleChange = (e: React.FormEvent) => {
    console.log(" I m hereee");
    e.preventDefault();
    setError({ isError: false, message: "", field: "" });
    // do form validation
    console.log(" I m hereee");
    if (!formPlatformFields.length) {
      setError({
        isError: true,
        message: "platform field cannot be empty",
        field: "platformName",
      });
      return;
    }
    console.log(" I m hereee");
    const formData = new FormData();
    submit(formData);
  };

  const gamePlatformInputProps = {
    platformDropdownList,
    setPlatformDropdownList,
    formPlatformFields,
    setFormPlatformFields,
    error,
  };
  const formPlatformListProps = {
    formPlatformFields,
    setFormPlatformFields,
    setPlatformDropdownList,
    platformDropdownList,
    dropdownList,
    error,
  };
  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          overflow: "inherit",
          margin: "15px 0 0 0",
        }}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[1] })}
      >
        <Card.Section inheritPadding py="md">
          <AddPlatform {...gamePlatformInputProps} />
        </Card.Section>
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <Form action="/admin/new" method="POST" onSubmit={handleChange}>
            <FormPlatformList {...formPlatformListProps} />
            <Button type="submit">Submit</Button>
          </Form>
        </Card.Section>
      </Card>
    </>
  );
};

export default AddGame;
