import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

// Start HTTP server in a single Node process
const port = env.port;

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
