# SVG Preview MCP Server

An MCP (Model Context Protocol) server that converts SVG content to high-resolution PNG images.

## Features

- Convert SVG string content to PNG images
- Convert SVG files to PNG images
- Configurable output dimensions and scale factor
- High-resolution output support (default 2x scale)
- Stateless HTTP transport

## Installation

```bash
npm install
npm run build
```

## Usage

### Starting the Server

```bash
npm start
# Or specify a custom port
PORT=8080 npm start
```

The server runs on port 3000 by default and exposes an MCP endpoint at `http://localhost:3000/mcp`.

### Available Tools

#### 1. `svg_preview` - Convert SVG content to PNG

Parameters:
- `svg` (string, required): SVG content as a string
- `width` (number, optional): Output width in pixels (default: 1920)
- `height` (number, optional): Output height in pixels (default: 1080)
- `scale` (number, optional): Scale factor for high resolution (default: 2)

Example request:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "svg_preview",
    "arguments": {
      "svg": "<svg>...</svg>",
      "width": 1920,
      "height": 1080,
      "scale": 2
    }
  },
  "id": 1
}
```

#### 2. `svg_preview_file` - Convert SVG file to PNG

Parameters:
- `filePath` (string, required): Path to SVG file
- `width` (number, optional): Output width in pixels (default: 1920)
- `height` (number, optional): Output height in pixels (default: 1080)
- `scale` (number, optional): Scale factor for high resolution (default: 2)

Example request:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "svg_preview_file",
    "arguments": {
      "filePath": "./example.svg",
      "width": 1920,
      "height": 1080,
      "scale": 2
    }
  },
  "id": 2
}
```

### Response Format

Successful response returns image data as base64:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [{
      "type": "image",
      "data": "iVBORw0KGgo...",
      "mimeType": "image/png"
    }],
    "isError": false
  },
  "id": 1
}
```

## Development

```bash
# Run in development mode
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Testing

A test client is included:
```bash
# Start the server in one terminal
npm start

# Run test client in another terminal
node test-client.js
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for building MCP servers
- `express` - HTTP server framework
- `sharp` - High-performance image processing
- `zod` - Schema validation

## License

MIT