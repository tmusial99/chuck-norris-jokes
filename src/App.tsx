import parse from "html-react-parser";
import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { fetchJokes } from "./utils/fetchJokes";
import { capitalizeFirstLetter } from "./utils/helpers";

function App() {
  const [joke, setJoke] = useState<null | string>(null);
  const [categories, setCategories] = useState<null | string[]>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState({
    isError: false,
    errorMsg: "",
  });
  const [isError, setIsError] = useState(false);

  const getJoke = async () => {
    const joke = await fetchJokes.randomJoke({
      withCustomCategory:
        selectedCategory === "all" ? undefined : selectedCategory,
      withCustomName:
        nameError.isError || name === ""
          ? undefined
          : [name.split(/\W+/)[0], name.split(" ")[1]],
    });
    typeof joke === "string"
      ? setJoke(joke)
      : setJoke(parse(joke.joke).toString());
  };
  const getCategories = async () => {
    try {
      const categories = await fetchJokes.categories();
      setCategories(categories);
    } catch {
      setIsError(true);
    }
  };
  const changeName = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const splittedValues = value.split(" ");
    if (splittedValues.length !== 2 || splittedValues[1] === "")
      setNameError({
        isError: true,
        errorMsg: "Invalid name.",
      });
    else
      setNameError({
        isError: false,
        errorMsg: "",
      });

    if (value === "")
      setNameError({
        isError: false,
        errorMsg: "",
      });
    setName(value);
  };

  useEffect(() => {
    getCategories();
    getJoke();
  }, []);

  if (isError)
    return (
      <div className="container">
        <h1>
          Chuck Norris API is currently unavailable. Please try to reload the
          page.
        </h1>
      </div>
    );

  return !joke || !categories ? null : (
    <div className="container">
      <p className="joke">{joke}</p>
      <div className="flex-row">
        <button onClick={getJoke}>{`Draw a ${
          name === "" || nameError.isError ? "Chuck Norris" : name
        } joke`}</button>
        <label htmlFor="categories">Category:</label>
        <select
          name="categories"
          id="categories"
          value={selectedCategory as string}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {capitalizeFirstLetter(category)}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="changeName">Impersonate Chuck Norris: </label>
        <input
          type="text"
          id="changeName"
          name="changeName"
          value={name}
          onChange={changeName}
        />
        {nameError.isError && (
          <div className="inputError">{nameError.errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default App;
