/** @type {import('next').NextConfig} */
export default {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  devIndicators: false
};
