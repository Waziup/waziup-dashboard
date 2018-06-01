import webpack from 'webpack';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  console.info("API_SERVER_URL: " + process.env.API_SERVER_URL)
  console.info("KEYCLOAK_URL: " + process.env.KEYCLOAK_URL)
  console.info("NODE_ENV: " + process.env.NODE_ENV)
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString(webpackConfig[0].stats));
      return resolve();
    });
  });
}

export default bundle;
