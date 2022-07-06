import { saveAs } from "file-saver";
import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { fetchJokes } from "./utils/fetchJokes";
import { capitalizeFirstLetter } from "./utils/helpers";

function App() {
  const [joke, setJoke] = useState<null | string>(null);
  const [categories, setCategories] = useState<null | string[]>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [name, setName] = useState("");
  const [amountOfJokes, setAmountOfJokes] = useState("5");
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
    typeof joke === "string" ? setJoke(joke) : setJoke(joke.joke);
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

  const downloadAsTxt = async () => {
    try {
      const jokes = await fetchJokes.randomJokes(parseInt(amountOfJokes), {
        withCustomCategory:
          selectedCategory === "all" ? undefined : selectedCategory,
        withCustomName:
          nameError.isError || name === ""
            ? undefined
            : [name.split(/\W+/)[0], name.split(" ")[1]],
      });
      const jokesInArray = jokes.map((x) => x.joke);
      const jokesInStringWithNewLineChars = jokesInArray.join("\n");
      const blob = new Blob([jokesInStringWithNewLineChars], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "funnyJokes.txt");
    } catch {
      alert(
        "Chuck Norris API is currently unavailable. Please try to reload the page."
      );
    }
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
      <div className="flex-row" style={{ marginTop: "20px" }}>
        <input
          type="number"
          min={1}
          max={999}
          placeholder="Amount"
          value={amountOfJokes}
          onChange={(e) => setAmountOfJokes(e.target.value)}
          onBlur={() =>
            setAmountOfJokes((curr) => {
              const roundedNumber = Math.round(parseInt(curr));
              if (roundedNumber > 999) return "999";
              else if (roundedNumber < 1) return "1";
              else return roundedNumber.toString();
            })
          }
        />
        <button onClick={downloadAsTxt}>Save jokes</button>
      </div>
    </div>
  );
}

export default App;
