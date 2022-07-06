export type jokeType = {
  type: "success" | string;
  value: {
    id: number;
    joke: string;
    categories: string[];
  };
};

export type multipleJokesType = {
  type: "success" | string;
  value: {
    id: number;
    joke: string;
    categories: string[];
  }[];
};

export type categoriesType = {
  type: "success" | string;
  value: string[];
};

export type numberOfJokesType = {
  type: "success" | string;
  value: number;
};
