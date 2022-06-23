import Vue from 'vue'
import Notifications from 'vue-notification'
import { ethers } from 'ethers'
import axios from 'axios'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

Vue.use(Notifications)
export default async ({ $config, store }, inject) => {
	const {
		clStakinABi,
		clStakinAddress,
		cyberLizonAbi,
		cyberLizonAddress,
		heatContractAbi,
		heatContractAddress,
		cyberLionzMergerAbi,
		cyberLionzMergerAddress,
		cubzNetwork,
		evolvingHeat,
	} = $config.smartContracts
	const { infuraId, moralisApiKey } = $config.providers

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
		claimableReward: 0,
		loaded: -1,
		staking: '',
		evolving: '',
		Web3Modal: null,
		async contractState() {},

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
				window.ethereum = await this.Web3Modal.connect()
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

			if (account) {
				await this.setAccount(account)
			}

			await this.updateClaimableReward()

			setInterval(async () => {
				await this.updateClaimableReward()
			}, 30 * 1000)
		},

		async getNfts(newAccount) {
			const nftContract = new ethers.Contract(
				cyberLizonAddress,
				cyberLizonAbi,
				this.provider
			)
			try {
				let res = await axios.get(
					`https://deep-index.moralis.io/api/v2/${newAccount}/nft/${cyberLizonAddress}`,
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

				let results = [],
					i = 0
				for (let nft of res.data.result) {
					const token_uri = await nftContract.tokenURI(parseInt(nft.token_id))
					let metadata = await axios.get(`${token_uri}?${new Date().getTime()}`)
					metadata.data.id = i++
					results.push(metadata.data)
				}

				this.loaded = true
				return results
			} catch (err) {
				console.log(err)
			}
		},

		async getHeatInfo() {
			const heatContract = new ethers.Contract(
				heatContractAddress,
				heatContractAbi,
				this.provider
			)

			try {
				this.heatAmount = ethers.utils.formatEther(
					await heatContract.balanceOf(this.account)
				)
			} catch (e) {
				console.log(e)
			}
		},

		async burnHeat() {
			const heatContract = new ethers.Contract(
				heatContractAddress,
				heatContractAbi,
				this.provider.getSigner()
			)
			try {
				const isApproved = await heatContract.allowance(
					this.account,
					cyberLionzMergerAddress,
				)

				if (!isApproved) {
					const tx = await heatContract.approve(cyberLionzMergerAddress, type(uint256).max)
					await tx.wait()
				}

				const tx_heat = await heatContract.transferFrom(this.account, cyberLionzMergerAddress, evolvingHeat)
				this.evolving = 'Burning $HEAT...'
				await tx_heat.wait()

				return true
			} catch (err) {
				console.log(err)
				this.evolving = ''
				return false
			}
		},

		async updateClaimableReward() {
			const stakingContract = new ethers.Contract(
				clStakinAddress,
				clStakinABi,
				this.provider
			)

			try {
				console.log()
				this.claimableReward = ethers.utils.formatEther(
					await stakingContract.totalClaimableReward(this.account, 0)
				)
			} catch (e) {
				console.log(e)
			}
		},

		async getStakeInfo() {
			this.stakeInfo.userInfo = []

			const stakingContract = new ethers.Contract(
				clStakinAddress,
				clStakinABi,
				this.provider
			)
			this.claimableReward = await stakingContract.totalClaimableReward(
				this.account,
				0
			)
			this.stakeInfo.userInfo = await stakingContract.getUserStakedTokens(
				this.account,
				0
			)
			this.stakeInfo.total = await stakingContract.getTotalStakedItemsCount(0)
		},

		async stake(stakeItems) {
			const stakeCount = stakeItems.length
			if (!stakeCount) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: 'Please Select Any Items To <b>Stake</b>',
				})
				return
			}
			const nftContract = new ethers.Contract(
				cyberLizonAddress,
				cyberLizonAbi,
				this.provider.getSigner()
			)

			const tokenIds = stakeItems.map((id) =>
				parseInt(this.nfts[id].name.split('#')[1])
			)

			try {
				this.staking = 'Confirming...'

				const isApproved = await nftContract.isApprovedForAll(
					this.account,
					clStakinAddress
				)

				if (!isApproved) {
					const tx = await nftContract.setApprovalForAll(clStakinAddress, true)
					await tx.wait()
				}

				const stakingContract = new ethers.Contract(
					clStakinAddress,
					clStakinABi,
					this.provider.getSigner()
				)

				const tx_stake = await stakingContract.batchStake(0, tokenIds)
				this.staking = 'Staking...'
				await tx_stake.wait()

				this.nfts = []
				this.loaded = false

				await this.getStakeInfo()
				await this.getHeatInfo()
				this.nfts = await this.getNfts(this.account)

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Staked <b>${stakeCount} Item(s).</b>`,
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
					text: 'Please Select Any Items To <b>Unstake</b>',
				})
				return
			}

			try {
				this.staking = 'Confirming...'

				const stakingContract = new ethers.Contract(
					clStakinAddress,
					clStakinABi,
					this.provider.getSigner()
				)

				const tx_unstake = await stakingContract.batchUnstake(0, unstakeItems)
				this.staking = 'Unstaking...'
				await tx_unstake.wait()

				unstakeItems.map(function (value, key) {
					this.stakeItems.splice(value, 1)
				})
				this.nfts = []
				this.loaded = false

				await this.getStakeInfo()
				await this.getHeatInfo()
				this.nfts = await this.getNfts(this.account)

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Unstaked <b>${unstakeCount} Item(s)</b>.`,
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

		async evolve(cub1, cub2) {
			const heatContract = new ethers.Contract(
				heatContractAddress,
				heatContractAbi,
				this.provider.getSigner()
			)
			const cubzContract = new ethers.Contract(
				cyberLizonAddress,
				cyberLizonAbi,
				this.provider.getSigner()
			)
			try {
				this.evolving = "Confirming $HEAT..."
				const isHeatApproved = await heatContract.allowance(
					this.account,
					cyberLionzMergerAddress,
				)

				if (!isHeatApproved) {
					const tx = await heatContract.approve(cyberLionzMergerAddress, type(uint256).max)
					this.evolving = 'Approving $HEAT...'
					await tx.wait()
				}

				this.evolving = "Confirming Cubz..."
				const isCubzApproved = await cubzContract.isApprovedForAll(
					this.account,
					cyberLionzMergerAddress,
				)

				if (!isCubzApproved) {
					const tx = await cubzContract.setApprovalForAll(cyberLionzMergerAddress,true)
					this.evolving = 'Approving Cubz...'
					await tx.wait()
				}

				const mergerContract = new ethers.Contract(
					cyberLionzMergerAddress,
					cyberLionzMergerAbi,
					this.provider.getSigner()
				)

				const tx_merge = mergerContract.mergeCubz(cub1, cub2)
				
				this.evolving = 'Evolving...'
				await tx_merge.wait()
				return true
			} catch (err) {
				console.log(err)
				this.evolving = ''
				return false
			}
		},

		async setContract() {
			if (this.network.chainId !== $config.smartContracts.chainId) {
				await this.switchNetwork($config.smartContracts.chainId)
			}
			if (!this.account) {
				await this.connect()
			}

			const contract = new ethers.Contract(
				cyberLizonAddress,
				cyberLizonAbi,
				this.provider.getSigner()
			)

			this.contract = contract
			console.log(
				`Contected to: ${$config.smartContracts.cyberLizonAddress} Contract`
			)
		},

		async getContract() {
			if (this.contract) return this.contract
			try {
				await this.setContract()
				return this.contract
			} catch (e) {
				console.log(e)
			}
		},

		async mint() {
			// const contract = new ethers.Contract(
			// 	cyberLizonAddress,
			// 	cyberLizonAbi,
			// 	this.provider.getSigner()
			// )

			// const value = ethers.utils.parseEther(
			// 	(MINT_PRICE * this.mintQuantity).toString()
			// )

			// txResponse = await signedContract.mint(this.mintQuantity, {
			// 	value,
			// })
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
			if (!window.ethereum) {
				window.ethereum = await this.Web3Modal.connect()
			}

			wallet.network = await wallet.provider.getNetwork()

			const [account] = await wallet.provider.send('eth_requestAccounts')
			console.info('wallet connected', { account })

			if (account) {
				await wallet.setAccount(account)
			}
		},

		disconnect() {
			wallet.account = null
			wallet.accountCompact = 'Connect'
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

	wallet.init()

	inject('wallet', wallet)
}
