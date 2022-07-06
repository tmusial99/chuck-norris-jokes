import parse from "html-react-parser";
import { useEffect, useState } from "react";
import "./App.css";
import { fetchJokes } from "./utils/fetchJokes";
import { capitalizeFirstLetter } from "./utils/helpers";

function App() {
  const [joke, setJoke] = useState<null | string>(null);
  const [categories, setCategories] = useState<null | string[]>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isError, setIsError] = useState(false);

  const getJoke = async () => {
    const joke = await fetchJokes.randomJoke({
      withCustomCategory:
        selectedCategory === "all" ? undefined : selectedCategory,
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
        <button onClick={getJoke}>Draw a Chuck Norris joke</button>
        <select
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
    </div>
  );
}

export default App;
