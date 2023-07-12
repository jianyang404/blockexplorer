import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Tab.module.css";

const Tab = ({ group, children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(group[0]);

  useEffect(() => {
    group.forEach((el) => {
      if (pathname.toLowerCase().includes(el.toLowerCase())) setSelected(el);
    });
  }, [group, pathname]);

  const handleClick = (evt) => {
    navigate(`${evt.target.innerText.toLowerCase()}`);

    setSelected(evt.target.innerText);
  };

  return (
    <>
      <div className={styles["tab-name"]}>
        {group.map((el) => (
          <div
            key={el}
            onClick={handleClick}
            className={`${styles.tab} ${selected === el ? styles.active : ""}`}
          >
            {el}
          </div>
        ))}
      </div>
      <div className={styles["tab-content"]}>{children}</div>
    </>
  );
};

export default Tab;
