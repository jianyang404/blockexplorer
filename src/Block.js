import { BigNumber } from "alchemy-sdk";
import Transactions from "./Transactions";
import { Link } from "react-router-dom";
import "./Block.css";

const Block = ({ block }) => (
  <div className="block">
    {Object.entries(block).map(([key, value]) => {
      if (value instanceof BigNumber) value = parseInt(value, 10);

      if (typeof value === "object" && !Array.isArray(value))
        value = JSON.stringify(value, null, 2);

      if (key === "transactions") value = <Transactions transactions={value} />;

      if (key === "parentHash")
        value = <Link to={`/block/${value}`}>{value}</Link>;

      return (
        <div key={key} className="details">
          <div className="label">{key}</div>
          <div className="value">{value}</div>
        </div>
      );
    })}
  </div>
);

export default Block;
