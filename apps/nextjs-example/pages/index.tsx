import { AptosClient, BCS, TxnBuilderTypes, Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useAutoConnect } from "../components/AutoConnectProvider";
import { useAlert } from "../components/AlertProvider";
import { useEffect } from "react";

const WalletButtons = dynamic(() => import("../components/WalletButtons"), {
  suspense: false,
  ssr: false,
});

export const DEVNET_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

const aptosClient = new AptosClient(DEVNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

export default function App() {
  const { connected, disconnect, account, network, signAndSubmitTransaction } =
    useWallet();

  const { setAutoConnect } = useAutoConnect();
  const { setSuccessAlertHash } = useAlert();

  const onClickMintButton = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x4::aptos_token::mint",
      type_arguments: [],
      arguments: [
        "Test Collection 1",
        "Test Collection hehe",
        "Test Collection 1 V2 #100",
        "https://www.sotatek.com/wp-content/uploads/2021/05/logo-Sotatek-2021day-du.png",
        [],
        [],
        [],
      ],
    };
    const response = await signAndSubmitTransaction(payload);
    try {
      await aptosClient.waitForTransaction(response.hash);
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setAutoConnect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black">
        Aptos Mint NFT Demo (Devnet)
      </h1>
      <table className="table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white">
        {account ? (
          <tbody>
            <tr>
              <td className="px-8 py-4 border-t">
                <h3>Account</h3>
              </td>
              <td className="px-8 py-4 border-t break-all">
                <div>{account ? account.address : ""}</div>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 border-t">
                <h3>Public key</h3>
              </td>
              <td className="px-8 py-4 border-t break-all">
                <div>{account ? account.publicKey : ""}</div>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 border-t">
                <h3>Network</h3>
              </td>
              <td className="px-8 py-4 border-t">
                <div>{network ? network.name : ""}</div>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 border-t">
                <h3>Chain ID</h3>
              </td>
              <td className="px-8 py-4 border-t">
                <div>{network ? network.chainId : ""}</div>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 border-t w-1/4">
                <h3>Disconnect wallet</h3>
              </td>
              <td className="px-8 py-4 border-t break-all w-3/4">
                <div>
                  <button
                    className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
                      !connected
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                    onClick={disconnect}
                    disabled={!connected}
                  >
                    Disconnect
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td className="px-8 py-4 w-1/4">
                <h3>Connect a Wallet</h3>
              </td>
              <td className="px-8 py-4 w-3/4">
                <WalletButtons />
              </td>
            </tr>
          </tbody>
        )}
        <tbody>
          <tr>
            <td className="px-8 py-4 border-t w-1/4">
              <h3>Mint NFT V2</h3>
            </td>
            <td className="px-8 py-4 border-t break-all w-3/4">
              <div>
                <button
                  className={`bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ${
                    !connected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={onClickMintButton}
                  disabled={!connected}
                >
                  Mint
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
