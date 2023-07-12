import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Utils } from "alchemy-sdk";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import List from "../../components/List";
import styles from "./Account.module.css";
import { AlchemyContext } from "../../context";

const Account = ({ dispatch, balance, address, setAddress }) => {
  const alchemy = useContext(AlchemyContext);
  const navigate = useNavigate();
  const { accountId } = useParams();

  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let debounce;

    const getBalance = async () => {
      try {
        setIsLoadingBalance(true);
        setAddress(accountId);

        const result = await alchemy.core.getBalance(accountId);

        dispatch({ type: "balance", balance: result ? result.toString() : "" });
      } catch (err) {
        console.log(err);

        setErrorMessage(err.reason || err.message);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    if (accountId) debounce = setTimeout(getBalance, 500);

    return () => clearTimeout(debounce);
  }, [accountId, address, alchemy.core, dispatch, navigate, setAddress]);

  const handleChange = (evt) => {
    evt.preventDefault();

    setIsLoadingBalance(true);
    setAddress(evt.target.value);
    setErrorMessage("");

    navigate(`/account/${evt.target.value}`);

    if (!evt.target.value) {
      dispatch({ type: "balance", balance: 0 });

      setIsLoadingBalance(false);
    }
  };

  return (
    <>
      <Input
        value={address}
        onChange={handleChange}
        placeholder="Input account address..."
        errorMessage={address && errorMessage}
      />
      {isLoadingBalance ? (
        <Loader />
      ) : (
        <div className={styles.account}>
          <List
            name="ETH balance"
            value={balance ? Utils.formatEther(balance) : "-"}
          />
        </div>
      )}
    </>
  );
};

export default Account;
