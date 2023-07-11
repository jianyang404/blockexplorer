import "./List.css";

const List = ({ name, value }) => (
  <div className="details" key={name}>
    <div className="label">{name}</div>
    <div className="value">{value}</div>
  </div>
);

export default List;
