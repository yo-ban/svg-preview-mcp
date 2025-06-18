import { createMcpServer } from './mcp-server.js';
import { createStreamableHttpServer } from './streamable-http-server.js';

const port = process.env.PORT || process.argv[2] || "3002";

async function main() {
  console.log('Starting SVG Preview MCP Server...');
  
  // Create MCP server instance
  const mcpServer = createMcpServer();
  
  // Create and start HTTP server
  createStreamableHttpServer(mcpServer, parseInt(port));
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});