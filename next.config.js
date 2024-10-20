/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['jsvectormap'],
  webpack: (config, { isServer }) => {
    // Add a rule to handle Solidity files
    config.module.rules.push({
      test: /\.sol$/,
      use: 'raw-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
