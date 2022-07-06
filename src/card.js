import React from "react";
import classnames from "classnames";
import {questionMark} from "./consts";
import "./card.scss";

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <img src={questionMark} alt="dog" />
      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="dog" />
      </div>
    </div>
  );
};

export default Card;
