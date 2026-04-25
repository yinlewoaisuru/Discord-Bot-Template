require('dotenv').config();
const logger = require('./utils/logger');

let ClusterManager;
try {
  const hybridSharding = require('discord-hybrid-sharding');
  ClusterManager = hybridSharding.ClusterManager;
} catch (_) {
  ClusterManager = null;
}

if (!ClusterManager) {
  require('./main');
} else {
  const manager = new ClusterManager(`${__dirname}/main.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.TOKEN,
  });

  manager.on('clusterCreate', (cluster) => {
    logger.info(`[Cluster] Launched cluster ${cluster.id}`);
  });

  manager.spawn({ timeout: -1 }).catch((err) => {
    logger.error('[Cluster] Spawn failed:', err.message);
    process.exit(1);
  });
}
