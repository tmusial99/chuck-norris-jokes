import parse from "html-react-parser";
import { useEffect, useState } from "react";
import "./App.css";
import { fetchJokes } from "./utils/fetchJokes";

function App() {
  const [joke, setJoke] = useState<null | string>(null);
  const getJoke = async () => {
    const joke = await fetchJokes.randomJoke();
    typeof joke === "string"
      ? setJoke(joke)
      : setJoke(parse(joke.joke).toString());
  };

  useEffect(() => {
    getJoke();
  }, []);

  return joke === null ? null : (
    <div className="container">
      <p className="joke">{joke}</p>
      <button onClick={getJoke}>Draw a Chuck Norris joke</button>
    </div>
  );
}

export default App;
