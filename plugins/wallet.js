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
		cyberLionzAdultsAbi,
		cyberLionzAdultsAddress,
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
		nftsLionz: [],
		stakeInfo: {
			userInfo: {
				lionz: [],
				cubz: [],
			},
			total: 0,
		},
		heatAmount: 0,
		claimableReward: 0,
		loaded: -1,
		staking: '',
		evolving: '',
		Web3Modal: null,
		isEvolved: [],

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
			const nftAdultsContract = new ethers.Contract(
				cyberLionzAdultsAddress,
				cyberLionzAdultsAbi,
				this.provider
			)
			const mergerContract = new ethers.Contract(
				cyberLionzMergerAddress,
				cyberLionzMergerAbi,
				this.provider.getSigner()
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

				let cubz = [],
					evolved = [],
					i = 0
				let evolveLimit = await mergerContract.cubMaxTimesAllowedToUse()
				for (let nft of res.data.result) {
					const token_uri = await nftContract.tokenURI(parseInt(nft.token_id))
					let metadata = await axios.get(`${token_uri}?${new Date().getTime()}`)
					let arr = token_uri.split('/')
					const usedCount = await mergerContract.cubTimesUsed(nft.token_id)
					evolved.push(usedCount < evolveLimit)
					metadata.data.id = i++
					cubz.push(metadata.data)
				}
				this.isEvolved = evolved

				res = await axios.get(
					`https://deep-index.moralis.io/api/v2/${newAccount}/nft/${cyberLionzAdultsAddress}`,
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

				let lionz = []
				i = 0
				for (let nft of res.data.result) {
					const token_uri = await nftAdultsContract.tokenURI(parseInt(nft.token_id))
					let metadata = await axios.get(`${token_uri}?${new Date().getTime()}`)
					metadata.data.id = i++
					lionz.push(metadata.data)
				}

				this.loaded = true
				return { cubz, lionz }
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
					cyberLionzMergerAddress
				)

				if (!isApproved) {
					const tx = await heatContract.approve(
						cyberLionzMergerAddress,
						type(uint256).max
					)
					await tx.wait()
				}

				const tx_heat = await heatContract.transferFrom(
					this.account,
					cyberLionzMergerAddress,
					evolvingHeat
				)
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
				this.claimableReward = ethers.utils.formatEther(
					await stakingContract.totalClaimableReward(this.account, 0)
				)
			} catch (e) {
				console.log(e)
			}
		},

		async getStakeInfo() {
			this.stakeInfo.userInfo = {
				lionz: [],
				cubz: [],
			}

			const stakingContract = new ethers.Contract(
				clStakinAddress,
				clStakinABi,
				this.provider
			)
			const cubzReward = ethers.utils.formatEther(
				await stakingContract.totalClaimableReward(this.account, 0)
			)
			const lionzReward = ethers.utils.formatEther(
				await stakingContract.totalClaimableReward(this.account, 1)
			)
			this.claimableReward = parseInt(cubzReward) + parseInt(lionzReward)
			this.stakeInfo.userInfo.lionz = await stakingContract.getUserStakedTokens(
				this.account,
				1
			)
			this.stakeInfo.userInfo.cubz = await stakingContract.getUserStakedTokens(
				this.account,
				0
			)
			const cubzStakedCount = await stakingContract.getTotalStakedItemsCount(0)
			const lionzStakedCount = await stakingContract.getTotalStakedItemsCount(1)
			this.stakeInfo.total =
				cubzStakedCount.toNumber() + lionzStakedCount.toNumber()
		},

		async stake(stakeItems) {
			const lionzStakeCount = stakeItems.lionz.length
			const cubzStakeCount = stakeItems.cubz.length
			if (!lionzStakeCount && !cubzStakeCount) {
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
			const nftAdultsContract = new ethers.Contract(
				cyberLionzAdultsAddress,
				cyberLionzAdultsAbi,
				this.provider.getSigner()
			)

			const lionzTokenIds = stakeItems.lionz.map((id) =>
				parseInt(this.nftsLionz[id].name.split('#')[1])
			)
			const cubzTokenIds = stakeItems.cubz.map((id) =>
				parseInt(this.nfts[id].name.split('#')[1])
			)

			try {
				if (lionzStakeCount) {
					this.staking = 'Confirming Lionz...'

					const isApproved = await nftAdultsContract.isApprovedForAll(
						this.account,
						clStakinAddress
					)

					if (!isApproved) {
						const tx = await nftAdultsContract.setApprovalForAll(
							clStakinAddress,
							true
						)
						this.staking = 'Approving Lionz...'
						await tx.wait()
					}
				}

				if (cubzStakeCount) {
					this.staking = 'Confirming Cubz...'

					const isApproved = await nftContract.isApprovedForAll(
						this.account,
						clStakinAddress
					)

					if (!isApproved) {
						const tx = await nftContract.setApprovalForAll(clStakinAddress, true)
						this.staking = 'Approving Cubz...'
						await tx.wait()
					}
				}

				const stakingContract = new ethers.Contract(
					clStakinAddress,
					clStakinABi,
					this.provider.getSigner()
				)

				if (lionzStakeCount) {
					this.staking = 'Confirming...'
					const tx_stake = await stakingContract.batchStake(1, lionzTokenIds)
					this.staking = 'Staking Lionz...'
					await tx_stake.wait()
				}

				if (cubzStakeCount) {
					this.staking = 'Confirming...'
					const tx_stake = await stakingContract.batchStake(0, cubzTokenIds)
					this.staking = 'Staking Cubz...'
					await tx_stake.wait()
				}

				this.nfts = []
				this.nftsLionz = []
				this.loaded = false

				this.staking = 'Reloading...'

				await this.getStakeInfo()
				await this.getHeatInfo()
				const res = await this.getNfts(this.account)
				this.nfts = res.cubz
				this.nftsLionz = res.lionz

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Staked <b>${
						lionzStakeCount + cubzStakeCount
					} Item(s).</b>`,
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
			const lionzUnstakeCount = unstakeItems.lionz.length
			const cubzUnstakeCount = unstakeItems.cubz.length
			if (!lionzUnstakeCount && !cubzUnstakeCount) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					text: 'Please Select Any Items To <b>Unstake</b>',
				})
				return
			}

			try {
				const stakingContract = new ethers.Contract(
					clStakinAddress,
					clStakinABi,
					this.provider.getSigner()
				)

				if (lionzUnstakeCount) {
					this.staking = 'Confirming Lionz...'
					const tx_unstake = await stakingContract.batchUnstake(
						1,
						unstakeItems.lionz
					)
					this.staking = 'Unstaking Lionz...'
					await tx_unstake.wait()
				}

				if (cubzUnstakeCount) {
					this.staking = 'Confirming Cubz...'
					const tx_unstake = await stakingContract.batchUnstake(0, unstakeItems.cubz)
					this.staking = 'Unstaking Cubz...'
					await tx_unstake.wait()
				}

				this.nfts = []
				this.nftsLionz = []
				this.loaded = false

				this.staking = 'Reloading...'

				await this.getStakeInfo()
				await this.getHeatInfo()
				const res = await this.getNfts(this.account)
				this.nfts = res.cubz
				this.nftsLionz = res.lionz

				Vue.notify({
					group: 'foo',
					type: 'success',
					text: `Successfully Unstaked <b>${
						lionzUnstakeCount + cubzUnstakeCount
					} Item(s)</b>.`,
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
				this.evolving = 'Confirming $HEAT...'
				const isHeatApproved = await heatContract.allowance(
					this.account,
					cyberLionzMergerAddress
				)

				if (isHeatApproved._hex == '0x00') {
					const amount = ethers.utils.parseEther('1000000000')
					const tx = await heatContract.approve(cyberLionzMergerAddress, amount)
					this.evolving = 'Approving $HEAT...'
					await tx.wait()
				}

				this.evolving = 'Confirming Cubz...'
				const isCubzApproved = await cubzContract.isApprovedForAll(
					this.account,
					cyberLionzMergerAddress
				)

				if (!isCubzApproved) {
					const tx = await cubzContract.setApprovalForAll(
						cyberLionzMergerAddress,
						true
					)
					this.evolving = 'Approving Cubz...'
					await tx.wait()
				}

				if (
					(await cubzContract.ownerOf(cub1)) !== this.account ||
					(await cubzContract.ownerOf(cub2)) !== this.account
				) {
					Vue.notify({
						group: 'foo',
						type: 'error',
						title: '',
						text: 'You are using an already burnt cub.',
					})
					return false
				}

				const mergerContract = new ethers.Contract(
					cyberLionzMergerAddress,
					cyberLionzMergerAbi,
					this.provider.getSigner()
				)

				this.evolving = 'Evolving...'

				const tx_merge = await mergerContract.mergeCubz(cub2, cub1, {
					gasLimit: 250000,
				})

				await tx_merge.wait()
				return true
			} catch (err) {
				Vue.notify({
					group: 'foo',
					type: 'error',
					title: '',
					text: err,
				})
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
				const res = await this.getNfts(this.account)
				this.nfts = res.cubz
				this.nftsLionz = res.lionz
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
			wallet.nftsLionz = []
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
