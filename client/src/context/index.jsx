import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';


const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setwalletAddress] = useState("");
    const [provider, setprovider] = useState(null);
    const [contract, setcontract] = useState(null);
    const [showAlert, setshowAlert] = useState({ status: false, type: 'info', message: "" });

    const updateCurrentWalletAddress = async () => {
        const accounts = await window?.ethereum?.request({ method: 'eth_accounts' });

        if (accounts) setwalletAddress(accounts[0]);
    };

    useEffect(() => {
        updateCurrentWalletAddress();

        window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
    }, []);

    //* Set the smart contract and provider to the state
    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const newProvider = new ethers.providers.Web3Provider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);

            setprovider(newProvider);
            setcontract(newContract);
        };

        setSmartContractAndProvider();
    }, []);

    useEffect(() => {
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setshowAlert({ status: false, type: 'info', message: '' })

            }, [5000]);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <GlobalContext.Provider
         value={{
            contract,
            walletAddress,
            showAlert,
            setshowAlert
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);