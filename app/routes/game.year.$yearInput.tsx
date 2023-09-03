import * as React from "react";
import { ActionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { useLoaderData, useParams } from "@remix-run/react";
import { Button } from "@mantine/core";
import { DbReadGameByYearZod, dbGetGameByYear, getEndOfYear } from "~/utils";
import { ErrorCard } from "~/components";

export const loader = async ({ request, params }: ActionArgs) => {
  const errors = {
    yearInput: "",
  };
  const year = params.yearInput;
  if (typeof year !== "string" || !year?.length || year?.length > 4) {
    errors.yearInput = "please provide valid year input";
  }
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  const gameByYear = await dbGetGameByYear(parseInt(year!));

  return json(gameByYear);
};

const GameByYear: React.FC = () => {
  const yearInput = useParams();
  const gamesByYear = useLoaderData();
  const typeCheckGamesByyear = DbReadGameByYearZod.safeParse(gamesByYear);
  if (!typeCheckGamesByyear.success) {
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  return <Button>{yearInput.yearInput}</Button>;
};

export default GameByYear;
