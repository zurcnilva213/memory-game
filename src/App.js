import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@material-ui/core";
import Card from "./card";
import "./app.scss";
import {imageList} from "./consts";

const uniqueElementsArray = [
  {
    type: "b1",
    image: imageList[0]
  },
  {
    type: "b2",
    image: imageList[1]
  },
  {
    type: "b3",
    image: imageList[2]
  },
  {
    type: "b3",
    image: imageList[3]
  },
  {
    type: "b4",
    image: imageList[4]
  },
  {
    type: "b5",
    image: imageList[5]
  }
];

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
export default function App() {
  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  /**
   * Compare first card and second card
   * If two card is same then add selected card to cleared card list and reset open cards
   * If two card doesn't match, then reset open cards only
  * */
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  /**
   * If second card is opened, then
   *  add it to openCard list and plus moves amount
   * If first card is opened, then
   *  clearTimeout (this is required to avoid stack timeout action)
   *  insert card index to OpenCard list
  * */
  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  /**
   * When two card is selected then evaluate cards after 1s later.
   * and clean timeout action (to avoid stack event)
  * */
  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  /**
   * check selected card is flipped or not
  * */
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  /**
   * check selected card is active or inactive
  * */
  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  /**
   * reset all value
  * */
  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setMoves(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };

  return (
    <div className="App">
      <header>
        <h3>Memory Game For Testing</h3>
      </header>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Total moves:</span> {moves}
          </div>
        </div>
        <div className="restart">
          <Button onClick={handleRestart} color="primary" variant="contained">
            Restart
          </Button>
        </div>
      </footer>
    </div>
  );
}
