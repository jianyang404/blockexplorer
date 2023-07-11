import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Block from "./pages/Block";
import Transaction from "./pages/Transaction";
import { AlchemyContext } from "./context/AlchemyContext";

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
  const { pathname } = useLocation();
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [blockNumber, setBlockNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getBlockNumber = async () => {
      const latest = await alchemy.core.getBlockNumber();

      if (latest && !pathname.includes("transaction")) {
        setLatestBlockNumber(latest);
        setBlockNumber(latest);

        navigate(`/block/${latest}`);
      }
    };

    getBlockNumber();
  }, [navigate, pathname]);

  return (
    <AlchemyContext.Provider value={alchemy}>
      <div className="App">
        <h1>Blockchain Explorer</h1>

        <div className="latest">Latest Block Number: {latestBlockNumber}</div>

        <Routes>
          <Route
            path="block/:blockId"
            element={
              <Block
                blockNumber={blockNumber}
                setBlockNumber={setBlockNumber}
              />
            }
          />
          <Route path="transaction/:transactionId" element={<Transaction />} />
        </Routes>
      </div>
    </AlchemyContext.Provider>
  );
};

export default App;
