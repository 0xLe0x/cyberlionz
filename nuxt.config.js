import { abi  as cyberLizonAbi  } from  './artifacts/contracts/CyberLionz.sol/CyberLionzCubz.json'
import { abi as clStakinABi } from  './artifacts/contracts/CLstaking.sol/CyberlionStaking.json'
import { abi as heatContractAbi } from  './artifacts/contracts/HeatToken.sol/HeatToken.json'

export default {
	ssr: false, 
	target: 'static', //Static page generation 

	publicRuntimeConfig: {
		smartContracts: {
			clStakinABi:clStakinABi,
			clStakinAddress:process.env.STAKING_CONTRACT_ADDRESS,
			cyberLizonAbi:cyberLizonAbi,
			cyberLizonAddress: process.env.CONTRACT_ADDRESS,
			heatContractAbi: 	heatContractAbi,
			heatContractAddress: process.env.HEAT_CONTRACT_ADDRESS,
			cubzNetwork: process.env.CUBZ_NETWORK,
			chainId: process.env.CHAIN_ID,
			
		},
		hasDelayedReveal: false,
		providers:{
			infuraId: process.env.INFURA_SECRET,
			moralisApiKey: process.env.MORALIS_API_KEY,	
		},
		hackslipsBackendServer: process.env.HACKSLIPS_BACKEND_SERVER,
	},

	env: {
		hackslipsBackendServer:
			process.env.HACKSLIPS_BACKEND_SERVER || 'http://localhost:5000',
	},

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {

		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, // mobile responsive https://search.google.com/test/mobile-friendly
			{ name: 'format-detection', content: 'telephone=no' },
		],
		link: [
			{
				hid: 'canonical',
				rel: 'canonical',
				href: process.env.URL,
			},
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Questrial&family=Roboto:wght@400;500;700;900&display=swap',
			},
		],
		script: [
			{
				src: '/Build/webgl.loader.js',
			},
			{
				src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
			},
			{
				src: 'https://kit.fontawesome.com/43d7c4e320.js',
			},
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['aos/dist/aos.css'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'@/plugins/wallet',
		{ src: '@/plugins/aos', mode: 'client' },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// 'nuxt-vite',
		'@nuxtjs/tailwindcss',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		'@nuxtjs/sitemap',
		'@nuxtjs/axios',
		'@nuxtjs/toast',
		'@nuxtjs/gtm',
		'@nuxtjs/proxy',
	],

	gtm: {
		id: 'GTM-W9T26K4',
	},

	bootstrapVue: {
		icons: true,
	},

	toast: {
		position: 'top-center',
	},

	sitemap: {
		hostname:process.env.URL,
		exclude: ['/admin/**'],
		defaults: {
			changefreq: 'daily',
			priority: 1,
			lastmod: new Date(),
		},
	},

	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css',
		configPath: 'tailwind.config.js',
		exposeConfig: false,
		config: {},
		injectPosition: 0,
		viewer: true,
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		transpile:[
			'web3modal-vue'
		]
	},

	axios: {
		proxy: true,
	},

	proxy: {
		'/.netlify/functions/': {
			target: 'http://localhost:9999/.netlify/functions/',
			pathRewrite: { '^/.netlify/functions/': '' },
		},
	},
}
