import Vue from 'vue'
import { ethers } from 'ethers'

import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'
import axios from 'axios'
import siteConfig from '@/siteConfig.json'

export default (
    { store, $config: { contractAddress, moralisApiKey, cubzNetwork } },
    inject
) => {
    const wallet = Vue.observable({
        account: null,
        accountCompact: 'Connect',
        network: null,
        balance: null,
        provider: null,
        nfts: [],
        loaded: false,
        Web3Modal: null,
        async contractState(){},

        get hexChainId() {
            return '0x' + this.network?.chainId?.toString(16)
        },
        get networkName() {
            return this.network?.name
        },
        get chainId() {
            return this.network?.chainId
        },

		async init() {
			// skip this and autologin
			if (!window.ethereum) {
				window.ethereum = await this.Web3Modal.connect();
			}

			window.ethereum.on('accountsChanged', ([newAddress]) => {
				console.info('accountsChanged', newAddress)
				this.setAccount(newAddress)
			})
	
			window.ethereum.on('chainChanged', (chainId) => {
				console.info('chainChanged', chainId)
				window.location.reload()
			})

			this.provider = new ethers.providers.Web3Provider(window.ethereum) //prefably diff node like Infura, Alchemy or Moralis
			this.network = await this.provider.getNetwork()
			const [account] = await this.provider.listAccounts()

			if(account){
				await this.setAccount(account)
			}
		},

        async getNfts(newAccount) {
            try {
                let res = await axios.get(
                    `https://deep-index.moralis.io/api/v2/${newAccount}/nft/${contractAddress}`,
                    {
                        params: {
                            chain: cubzNetwork,
                            format: 'decimal',
                        },
                        headers: {
                            'x-api-key': moralisApiKey,
                        },
                    }
                )

                const { chainId, abi, address } = siteConfig.smartContract

                const nftContract = new ethers.Contract(contractAddress, abi, this.provider)
                let results = [],
                    i = 0
                for (let nft of res.data.result) {
                    const token_uri = await nftContract.tokenURI(parseInt(nft.token_id))
                    let metadata = await axios.get(
                        'https://ipfs.io/ipfs' + token_uri.substring(6)
                    )
                    console.log(metadata)
                    metadata.data.id = i++
                    results.push(metadata.data)
                }
                return results
            } catch (err) {
                console.log(err)
            }
        },

        async stake(stakeId) {
            const nftContract = new ethers.Contract(
                contractAddress,
                siteConfig.smartContract.abi,
                this.provider.getSigner()
            )
            const { abi, address } = siteConfig.stakingContract

            const tokenId = parseInt(this.nfts[stakeId].name.split('#')[1])
            try {
                const tx = await nftContract.approve(address, tokenId)
                await tx.wait()

                const stakingContract = new ethers.Contract(
                    address,
                    abi,
                    this.provider.getSigner()
                )

                await stakingContract.stake(0, tokenId)
                alert('successfully staked!')
            } catch (err) {
                console.log(err)
            }
        },

        async setAccount(newAccount) {
            if (newAccount) {
                this.loaded = false
                this.account = newAccount
                this.accountCompact = `${newAccount.substring(
                    0,
                    4
                )}...${newAccount.substring(newAccount.length - 4)}`

                const balance = (await this.provider.getBalance(newAccount)).toString()
                this.balance = `${(+ethers.utils.formatEther(balance)).toFixed(
                    3
                )} ${getCurrency(this.network.chainId)}`
                this.nfts = await this.getNfts(newAccount)
                console.log('nfts: ', this.nfts)
                this.loaded = true
            } else {
                this.disconnect()
            }
        },

        async connect() {
           if (!window.ethereum) {
				window.ethereum = await this.Web3Modal.connect();
			}
            wallet.network = await wallet.provider.getNetwork()

            const [account] = await wallet.provider.send('eth_requestAccounts')
            console.info('wallet connected', { account })

            if (account) {
                // await wallet.setAccount(account)
            }
        },

        disconnect() {
            wallet.account = null
            wallet.accountCompact = null
            wallet.balance = null
            wallet.nfts = []
            wallet.loaded = false
        },

        async switchNetwork(chainId) {
            if (!chainId || this.chainId === chainId || this.hexChainId === chainId) {
                return
            }

            const config = CHAINID_CONFIG_MAP[chainId]

            try {
                await this.provider.send('wallet_switchEthereumChain', [
                    { chainId: config.chainId },
                ])

                // await this.init()

                // create a small delay to let the wallet reset to new network
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 1000)
                })
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (err.code === 4902) {
                    await this.provider.send('wallet_addEthereumChain', [config])
                } else {
                    throw err
                }
            }
        },

        async requestSignature(nonce) {
            const signer = this.provider.getSigner()
            const msg = `Hi there from the Zero Code NFT! Sign this unique ID to sign in: ${nonce}`
            return signer.signMessage(msg)
        },
    })

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', ([newAddress]) => {
            console.info('accountsChanged', newAddress)
            wallet.setAccount(newAddress)
        })

        window.ethereum.on('chainChanged', async (chainId) => {
            console.info('chainChanged', chainId)
            wallet.init()
        })
        wallet.init()
    }

    inject('wallet', wallet)
}
