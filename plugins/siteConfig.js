import siteConfig from '@/siteConfig.json';

export default ({ env }, inject) => {

    inject('siteConfig', siteConfig)
}
