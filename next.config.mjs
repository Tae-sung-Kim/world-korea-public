/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.**.co(m|.kr)' }, //테스트 url
      { protocol: 'http', hostname: '**.**.co(m|.kr)' },
    ],
  },
  sassOptions: {
    includePaths: ['./src/styles', './src/app'],
  },
};

export default nextConfig;
