import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import List from "../../components/List";
import Select from "../../components/Select";
import Loader from "../../components/Loader";
import { AlchemyContext } from "../../context/AlchemyContext";
import { BigNumber } from "alchemy-sdk";
import "./Block.css";

const Block = ({ blockNumber, setBlockNumber }) => {
  const alchemy = useContext(AlchemyContext);

  const { blockId } = useParams();
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const [block, setBlock] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setBlock({});

    const getBlock = async () => {
      try {
        setBlockNumber(blockId);
        setIsLoadingBlock(true);

        const block = await alchemy.core.getBlockWithTransactions(
          blockId.startsWith("0x") ? blockId : +blockId
        );

        setIsLoadingBlock(false);

        if (block) {
          setBlock(block);
        } else {
          setBlock({});
          throw new Error("block does not exist");
        }
      } catch (err) {
        console.log(err);

        setErrorMessage(err.reason || err.message);
      }
    };

    if (blockId) getBlock();
  }, [alchemy.core, blockId, setBlockNumber]);

  const handleChange = async (evt) => {
    evt.preventDefault();

    setErrorMessage("");
    setBlockNumber(evt.target.value);

    if (!evt.target.value) return setBlock({});

    try {
      if (Number.isNaN(+evt.target.value))
        throw new Error("block number or hash only");

      setIsLoadingBlock(true);

      const block = await alchemy.core.getBlockWithTransactions(
        evt.target.value.startsWith("0x") ? evt.target.value : +evt.target.value
      );

      setIsLoadingBlock(false);

      if (block) {
        setBlock(block);
      } else {
        setBlock({});
        throw new Error("block does not exist");
      }
    } catch (err) {
      console.log(err);

      setErrorMessage(err.reason || err.message);
    }
  };

  return (
    <>
      <div className="input-container">
        <input
          placeholder="Input block number or hash..."
          value={blockNumber}
          onChange={handleChange}
        />
        {blockNumber && errorMessage && (
          <span className="error">{errorMessage}</span>
        )}
      </div>
      {isLoadingBlock ? (
        <Loader />
      ) : (
        <div className="block">
          {Object.entries(block).map(([key, value]) => {
            // Has to go first or else React elements will get converted
            if (value instanceof BigNumber) value = parseInt(value, 10);

            // Same as the above
            if (typeof value === "object" && !Array.isArray(value))
              value = JSON.stringify(value, null, 2);

            if (key === "transactions") value = <Select options={value} />;

            if (key === "parentHash")
              value = <Link to={`/block/${value}`}>{value}</Link>;

            if (key === "_difficulty") return null;

            return <List key={key} name={key} value={value} />;
          })}
        </div>
      )}
    </>
  );
};

export default Block;
