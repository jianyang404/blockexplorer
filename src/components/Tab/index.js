import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Tab.css";

const Tab = ({ group, children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(group[0]);

  useEffect(() => {
    group.forEach((el) => {
      console.log(pathname, el);
      if (pathname.toLowerCase().includes(el.toLowerCase())) setSelected(el);
    });
  }, [group, pathname]);

  const handleClick = (evt) => {
    navigate(`${evt.target.innerText.toLowerCase()}`);

    setSelected(evt.target.innerText);
  };

  return (
    <div>
      <div className="tab-name">
        {group.map((el) => (
          <div
            key={el}
            onClick={handleClick}
            className={`tab ${selected === el ? "active" : ""}`}
          >
            {el}
          </div>
        ))}
      </div>
      <div className="tab-content">{children}</div>
    </div>
  );
};

export default Tab;
