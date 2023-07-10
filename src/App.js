import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Block from "./Block";
import Loader from "./components/Loader/Loader";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const App = () => {
  const { blockId } = useParams();

  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [blockNumber, setBlockNumber] = useState("");
  const [block, setBlock] = useState({});
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setBlock({});

    async function getBlockNumber() {
      setLatestBlockNumber(await alchemy.core.getBlockNumber());
    }
    async function getBlock() {
      setBlockNumber(blockId);

      setIsLoadingBlock(true);
      const block = await alchemy.core.getBlockWithTransactions(
        blockId.startsWith("0x") ? blockId : +blockId
      );

      setBlock(block);
      setIsLoadingBlock(false);
    }

    getBlockNumber();
    if (blockId) getBlock();
  }, [blockId]);

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

      setBlock(block);
      setIsLoadingBlock(false);
    } catch (err) {
      console.log(err);

      setErrorMessage(err.reason || err.message);
    }
  };

  return (
    <div className="App">
      <h1>Block Explorer</h1>

      <div className="latest">Latest Block Number: {latestBlockNumber}</div>

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

      {isLoadingBlock ? <Loader /> : <Block block={block} />}
    </div>
  );
};

export default App;
