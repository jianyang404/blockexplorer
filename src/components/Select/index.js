import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Select.module.css";

const Select = ({ options }) => {
  const navigate = useNavigate();

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

    navigate(`/transaction/${evt.target.innerText}`);
  };

  return options.length ? (
    <div className={styles.dropdown} onClick={handleDropdown}>
      <div className={styles.selected}>
        <Link to={`/transaction/${selected}`}>{selected}</Link>
        <div
          className={`${styles.arrow} ${showOptions ? styles.up : styles.down}`}
        />
      </div>

      {showOptions && (
        <div className={styles.options}>
          {options.map((el) => (
            <div key={el.hash} onClick={handleOption} className={styles.option}>
              {el.hash}
            </div>
          ))}
          <div className={styles.overlay} onClick={handleClose} />
        </div>
      )}
    </div>
  ) : (
    "-"
  );
};

export default Select;
