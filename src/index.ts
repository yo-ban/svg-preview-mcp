import { createMcpServer } from './mcp-server.js';
import { createStreamableHttpServer } from './streamable-http-server.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

async function main() {
  console.log('Starting SVG Preview MCP Server...');
  
  // Create MCP server instance
  const mcpServer = createMcpServer();
  
  // Create and start HTTP server
  createStreamableHttpServer(mcpServer, PORT);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});