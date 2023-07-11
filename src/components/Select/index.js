import { useState } from "react";
import { Link } from "react-router-dom";
import "./Select.css";

const Select = ({ options }) => {
  const [selected, setSelected] = useState(options[0]?.hash || "");
  const [showOptions, toggleOptions] = useState(false);

  const handleDropdown = () => {
    toggleOptions(!showOptions);
  };

  const handleClose = () => {
    toggleOptions(false);
  };

  const handleOption = (evt) => {
    setSelected(evt.target.innerText);
  };

  return options.length ? (
    <div className="dropdown" onClick={handleDropdown}>
      <div className="selected">
        <Link to={`/transaction/${selected}`}>{selected}</Link>
        <div className={`arrow ${showOptions ? "up" : "down"}`} />
      </div>

      {showOptions && (
        <div className="options">
          {options.map((el) => (
            <div key={el.hash} onClick={handleOption} className="option">
              {el.hash}
            </div>
          ))}
          <div className="overlay" onClick={handleClose} />
        </div>
      )}
    </div>
  ) : (
    "-"
  );
};

export default Select;
