import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import List from "../../components/List";
import Select from "../../components/Select";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import { AlchemyContext } from "../../context";
import { BigNumber } from "alchemy-sdk";
import styles from "./Block.module.css";

const Block = ({ blockNumber, setBlockNumber, dispatch, block }) => {
  const alchemy = useContext(AlchemyContext);

  const navigate = useNavigate();
  const { blockId } = useParams();

  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let debounce;

    const getBlock = async () => {
      try {
        setIsLoadingBlock(true);
        setBlockNumber(blockId);

        if (Number.isNaN(+blockId))
          throw new Error("block number or hash only");

        const result = await alchemy.core.getBlockWithTransactions(
          blockId.startsWith("0x") ? blockId : +blockId
        );

        if (result) {
          dispatch({ type: "block", block: result });
        } else {
          dispatch({ type: "block", block: {} });
          throw new Error("block does not exist");
        }
      } catch (err) {
        console.log(err);

        setErrorMessage(err.reason || err.message);
      } finally {
        setIsLoadingBlock(false);
      }
    };

    if (blockId) debounce = setTimeout(getBlock, 500);

    return () => clearTimeout(debounce);
  }, [alchemy.core, blockId, setBlockNumber, blockNumber, navigate, dispatch]);

  const handleChange = async (evt) => {
    evt.preventDefault();

    setIsLoadingBlock(true);
    setBlockNumber(evt.target.value);
    setErrorMessage("");

    navigate(`/block/${evt.target.value}`);

    if (!evt.target.value) {
      dispatch({ type: "block", block: {} });

      setIsLoadingBlock(false);
    }
  };

  return (
    <>
      <Input
        value={blockNumber}
        onChange={handleChange}
        placeholder="Input block number or hash..."
        errorMessage={blockNumber ? errorMessage : null}
      />

      {isLoadingBlock ? (
        <Loader />
      ) : (
        <div className={styles.block}>
          {Object.entries(block).map(([key, value]) => {
            // Has to go first or else React elements will get converted
            if (value instanceof BigNumber) value = parseInt(value, 10);

            // Same as the above
            if (typeof value === "object" && !Array.isArray(value))
              value = JSON.stringify(value, null, 2);

            if (key === "transactions") value = <Select options={value} />;

            if (key === "parentHash")
              value = <Link to={`/block/${value}`}>{value}</Link>;

            if (key === "miner")
              value = <Link to={`/account/${value}`}>{value}</Link>;

            if (key === "_difficulty") return null;

            return <List key={key} name={key} value={value} />;
          })}
        </div>
      )}
    </>
  );
};

export default Block;
