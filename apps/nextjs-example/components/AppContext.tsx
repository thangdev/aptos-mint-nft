import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";
import { FaceWallet } from "@haechi-labs/face-aptos-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import {
  AptosWalletAdapterProvider,
  NetworkName,
} from "@aptos-labs/wallet-adapter-react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { FC, ReactNode } from "react";
import face from "../lib/faceInitialization";
import { AlertProvider, useAlert } from "./AlertProvider";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { setErrorAlertMessage } = useAlert();

  const wallets = [
    // Blocto supports Testnet/Mainnet for now.
    new PetraWallet(),
    new MartianWallet(),
    new BloctoWallet({
      network: NetworkName.Testnet,
      bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
    }),
    new FaceWallet(face!),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={autoConnect}
      onError={(error) => {
        console.log("Custom error handling", error);
        setErrorAlertMessage(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <AlertProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
      </AlertProvider>
    </AutoConnectProvider>
  );
};
