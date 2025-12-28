/** @type {import('next').NextConfig} */
export default {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  devIndicators: false
};
