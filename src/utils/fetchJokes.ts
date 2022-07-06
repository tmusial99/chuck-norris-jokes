import axios from "axios";
import { jokeType, multipleJokesType } from "../../types/jokes";

type fetchJokeOptions = {
  withCustomName?: [firstName: string, lastName: string];
  withCustomCategory?: "nerdy" | "explicit" | string;
};

export const fetchJokes = {
  randomJoke: async (options?: fetchJokeOptions) => {
    const apiURL = new URL("http://api.icndb.com/jokes/random");
    if (options?.withCustomName) {
      apiURL.searchParams.append("firstName", options.withCustomName[0]);
      apiURL.searchParams.append("lastName", options.withCustomName[1]);
    }

    if (options?.withCustomCategory)
      apiURL.searchParams.append("limitTo", `[${options.withCustomCategory}]`);

    try {
      const { data }: { data: jokeType } = await axios.get(apiURL.toString());
      return data.value;
    } catch {
      return "Chuck Norris API is currently unavailable. Please try again later.";
    }
  },
  randomJokes: async (quantity: number, options?: fetchJokeOptions) => {
    if (quantity <= 0 || !Number.isInteger(quantity))
      throw Error("Quantity must be positive integer type number");

    const apiURL = new URL(`http://api.icndb.com/jokes/random/${quantity}`);

    if (options?.withCustomName) {
      apiURL.searchParams.append("firstName", options.withCustomName[0]);
      apiURL.searchParams.append("lastName", options.withCustomName[1]);
    }

    if (options?.withCustomCategory)
      apiURL.searchParams.append("limitTo", `[${options.withCustomCategory}]`);

    try {
      const { data }: { data: multipleJokesType } = await axios.get(
        apiURL.toString()
      );
      return data.value;
    } catch {
      throw Error(
        "Chuck Norris API is currently unavailable. Please try again later."
      );
    }
  },
};
