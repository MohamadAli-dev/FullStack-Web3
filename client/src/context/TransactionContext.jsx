import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  console.log({
    provider,
    signer,
    transactionContract,
  })
}

export const TransactionProvider = ({ children }) => {
  const [formData, setFomData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })

  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  )

  const handleChange = (e, name) => {
    setFomData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }))
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask!')

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])

        // getAllTransactions();
      } else {
        console.log('No accounts found')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object.')
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask!')

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum object.')
    }
  }

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData
        const transactionsContract = createEthereumContract()
        const parsedAmount = ethers.utils.parseEther(amount)

        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: '0x5208',
              value: parsedAmount._hex,
            },
          ],
        })

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword,
        )

        setIsLoading(true)
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait()
        console.log(`Success - ${transactionHash.hash}`)
        setIsLoading(false)

        const transactionsCount = await transactionsContract.getTransactionCount()

        setTransactionCount(transactionsCount.toNumber())
      } else {
        console.log('No ethereum object')
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum object')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFomData,
        handleChange,
        sendTransaction,
        transactionCount,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
