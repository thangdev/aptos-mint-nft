import { AptosClient, Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useAlert } from "../components/AlertProvider";
import { Provider, Network } from "aptos";
import { useEffect, useState } from "react";

const WalletButtons = dynamic(() => import("../components/WalletButtons"), {
  suspense: false,
  ssr: false,
});

export const TESTNET_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";

const aptosClient = new AptosClient(TESTNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

const provider = new Provider(Network.TESTNET);

export default function App() {
  const { connected, disconnect, account, network, signAndSubmitTransaction } =
    useWallet();

  const { setSuccessAlertHash } = useAlert();

  const [accountCollections, setAccountCollections] = useState<any>();

  const onClickMintButton = async () => {
    // Random number from 1 - 999999
    const randomNumber = Math.floor(Math.random() * 999999) + 1;

    if (accountCollections === "") {
      const createCollectionPayload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: "0x4::aptos_token::create_collection",
        type_arguments: [],
        arguments: [
          "This is Sotatek test collection",
          "1000000000",
          "Sota Test Collection #1",
          "https://www.sotatek.com/wp-content/uploads/2021/05/logo-Sotatek-2021day-du.png",
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          "100",
          "10000",
        ],
      };
      const createCollectionResponse = await signAndSubmitTransaction(
        createCollectionPayload
      );
      try {
        const createCollectionReceipt =
          await aptosClient.waitForTransactionWithResult(
            createCollectionResponse.hash,
            { checkSuccess: true }
          );
        if (createCollectionReceipt.hash) {
          const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: "0x4::aptos_token::mint",
            type_arguments: [],
            arguments: [
              "Sota Test Collection #1",
              "Sota Testnet NFT",
              `Test Sota NFT V2 #${randomNumber}`,
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
            fetchList();
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: "0x4::aptos_token::mint",
        type_arguments: [],
        arguments: [
          "Sota Test Collection #1",
          "Sota Testnet NFT",
          `Test Sota NFT V2 #${randomNumber}`,
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
    }
  };

  const fetchList = async () => {
    if (!account) return [];
    try {
      const CollectionResource = await provider.getCollectionAddress(
        account.address,
        "Sota Test Collection #1"
      );
      setAccountCollections(CollectionResource);
    } catch (e: any) {
      setAccountCollections("");
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  return (
    <div>
      <h1 className="flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black">
        Aptos Mint NFT Demo (Testnet only)
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
