// next.config.js
import path from 'path';

module.exports = {
  webpack: (config: any) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};