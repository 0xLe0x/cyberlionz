import Vue from 'vue'
import Notifications from 'vue-notification'
import { ethers } from 'ethers'
import MetaMaskOnboarding from '@metamask/onboarding'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'
import axios from 'axios'
import siteConfig from '@/siteConfig.json'
Vue.use(Notifications)
export default (
	{
		store,
		$config: {
			contractAddress,
			stakingContractAddress,
			heatContractAddress,
			moralisApiKey,
			cubzNetwork,
		},
	},
	inject
) => {
	const wallet = Vue.observable({
		account: null,
		accountCompact: 'Connect',
		network: null,
		balance: null,
		provider: null,
		nfts: [],
		stakeInfo: {
			userInfo: [],
			total: 0,
		},
		heatAmount: 0,
		loaded: -1,
		staking: '',

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
			this.provider = new ethers.providers.Web3Provider(window.ethereum) //prefably diff node like Infura, Alchemy or Moralis
			this.network = await this.provider.getNetwork()
			const [account] = await this.provider.listAccounts()

			!!account && this.setAccount(account)
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
					metadata.data.id = i++
					results.push(metadata.data)
				}
				console.log(results)
				this.loaded = true
				return results
			} catch (err) {
				console.log(err)
			}
		},

		async getHeatInfo() {
			const { abi, address } = siteConfig.heatContract
			const heatContract = new ethers.Contract(
				heatContractAddress,
				abi,
				this.provider
			)

			this.heatAmount = await heatContract.balanceOf(this.account)
			// console.log(this.heatAmount)
		},

		async getStakeInfo() {
			this.stakeInfo.userInfo = []

			const { abi, address } = siteConfig.stakingContract
			const stakingContract = new ethers.Contract(
				stakingContractAddress,
				abi,
				this.provider
			)

			this.stakeInfo.userInfo = await stakingContract.getUserInformation(
				this.account,
				'0xC24AB607B2c0206793d255393F7E3F0592b2db15'
			)
			this.stakeInfo.total = await stakingContract.getTotalStakedItemsCount(0)
			console.log(this.stakeInfo)
		},

		async stake(stakeItems) {
			const stakeCount = stakeItems.length
			if (!stakeCount) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Please Select Any Items To Stake',
				})
				return
			}
			const nftContract = new ethers.Contract(
				contractAddress,
				siteConfig.smartContract.abi,
				this.provider.getSigner()
			)
			const { abi, address } = siteConfig.stakingContract

			const tokenIds = stakeItems.map((id) =>
				parseInt(this.nfts[id].name.split('#')[1])
			)

			try {
				this.staking = 'Confirming...'

				const isApproved = await nftContract.isApprovedForAll(
					this.account,
					stakingContractAddress
				)

				if (!isApproved) {
					const tx = await nftContract.setApprovalForAll(
						stakingContractAddress,
						true
					)
					await tx.wait()
				}

				const stakingContract = new ethers.Contract(
					stakingContractAddress,
					abi,
					this.provider.getSigner()
				)

				const tx_stake = await stakingContract.batchStake(0, tokenIds)
				this.staking = 'Staking...'
				await tx_stake.wait()

				this.nfts = []
				this.loaded = false

				await this.getStakeInfo()
				await this.getHeatInfo()
				await this.getNfts(this.account)

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Staked ${stakeCount} Item(s).`,
				})
				Vue.notify({
					group: 'foo',
					type: 'warn',
					text: `It may take some time to get updated inventory. Your items may not be displayed correctly.`,
					duration: 8000,
				})

				this.staking = ''
			} catch (err) {
				console.log(err)
				this.staking = ''
			}
		},

		async unstake(unstakeItems) {
			const unstakeCount = unstakeItems.length
			if (!unstakeCount) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					text: 'Please Select Any Items To Unstake',
				})
				return
			}
			const { abi, address } = siteConfig.stakingContract

			try {
				this.staking = 'Confirming...'

				const stakingContract = new ethers.Contract(
					stakingContractAddress,
					abi,
					this.provider.getSigner()
				)

				const tx_unstake = await stakingContract.batchUnstake(0, unstakeItems)
				this.staking = 'Unstaking...'
				await tx_unstake.wait()

				this.nfts = []
				this.loaded = false

				await this.getStakeInfo()
				await this.getHeatInfo()
				await this.getNfts(this.account)

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Unstaked ${unstakeCount} Item(s). It may take some time to get updated inventory`,
				})
				Vue.notify({
					group: 'foo',
					type: 'warn',
					text: `It may take some time to get updated inventory. Your items may not be displayed correctly.`,
					duration: 8000,
				})

				this.staking = ''
			} catch (err) {
				console.log(err)
				this.staking = ''
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
				this.getStakeInfo()
				this.getHeatInfo()
			} else {
				this.disconnect()
			}
		},

		async connect() {
			if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
				const onboarding = new MetaMaskOnboarding()
				onboarding.startOnboarding()
				return
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
