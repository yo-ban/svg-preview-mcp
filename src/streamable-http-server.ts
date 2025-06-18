import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

export function createStreamableHttpServer(mcpServer: McpServer, port: number) {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // Create transport with stateless configuration
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless
  });

  // Connect the McpServer to the transport
  mcpServer.connect(transport)
    .then(() => {
      console.log('McpServer connected to stateless StreamableHTTPServerTransport');
    })
    .catch(error => {
      console.error('Error connecting McpServer to transport:', error);
    });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'svg-preview-mcp' });
  });

  // MCP endpoint
  app.post('/mcp', async (req, res) => {
    try {
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error' },
          id: null
        });
      }
    }
  });

  // Handle non-POST methods
  app.get('/mcp', (_req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method Not Allowed. Use POST for MCP requests.' },
      id: null
    });
  });

  // Start the server
  const server = app.listen(port, () => {
    console.log(`SVG Preview MCP server running at http://localhost:${port}`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  return { app, server, transport };
}