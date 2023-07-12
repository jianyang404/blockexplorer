import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState, useReducer } from "react";
import {
  useNavigate,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Account from "./pages/Account";
import Block from "./pages/Block";
import Transaction from "./pages/Transaction";
import Tab from "./components/Tab";
import { AlchemyContext } from "./context";
import { EthereumLogo } from "./components/Logo";
import styles from "./App.module.css";

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

export const reducer = (state, action) => {
  switch (action.type) {
    case "block": {
      return { ...state, block: action.block };
    }
    case "transaction": {
      return { ...state, transaction: action.transaction };
    }
    case "balance": {
      return { ...state, balance: action.balance };
    }
    default: {
      throw new Error(`Unknown type: ${action.type}`);
    }
  }
};

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [blockNumber, setBlockNumber] = useState("");
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [transactionHash, setTransactionHash] = useState("");
  const [address, setAddress] = useState("");

  const [{ balance, block, transaction }, dispatch] = useReducer(reducer, {
    balance: "",
    block: {},
    transaction: {},
  });

  useEffect(() => {
    let debounce;

    const getBlockNumber = async () => {
      try {
        const latest = await alchemy.core.getBlockNumber();
        setLatestBlockNumber(latest);
      } catch (err) {
        console.log(err);
      }
    };

    if (!latestBlockNumber) {
      setTimeout(getBlockNumber, 500);
    }

    return () => clearTimeout(debounce);
  }, [navigate, pathname, blockNumber, latestBlockNumber]);

  return (
    <AlchemyContext.Provider value={alchemy}>
      <div className={styles.App}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <EthereumLogo />
          </div>
          <h1>Ethereum Explorer</h1>
        </div>

        <div className={styles.latest}>
          Latest Block Number:{" "}
          <Link to={`/block/${latestBlockNumber}`}>{latestBlockNumber}</Link>
        </div>

        <Tab group={["Block", "Transaction", "Account"]}>
          <Routes>
            <Route
              path="block/:blockId?"
              element={
                <Block
                  dispatch={dispatch}
                  block={block}
                  blockNumber={blockNumber}
                  setBlockNumber={setBlockNumber}
                />
              }
            />
            <Route
              path="transaction/:transactionId?"
              element={
                <Transaction
                  dispatch={dispatch}
                  transaction={transaction}
                  transactionHash={transactionHash}
                  setTransactionHash={setTransactionHash}
                />
              }
            />
            <Route
              path="account/:accountId?"
              element={
                <Account
                  dispatch={dispatch}
                  balance={balance}
                  address={address}
                  setAddress={setAddress}
                />
              }
            />
          </Routes>
        </Tab>
      </div>
    </AlchemyContext.Provider>
  );
};

export default App;
