import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import sharp from 'sharp';

export function createMcpServer(): McpServer {
  const mcpServer = new McpServer({
    name: 'svg-preview-mcp',
    version: '1.0.0',
    capabilities: {
      tools: true,
    },
  });

  mcpServer.tool(
    'svg_preview',
    'Convert SVG to high-resolution PNG image',
    {
      svg: z.string().describe('SVG content as a string'),
      width: z.number().optional().default(1920).describe('Width of the output image in pixels (default: 1920)'),
      height: z.number().optional().default(1080).describe('Height of the output image in pixels (default: 1080)'),
      scale: z.number().optional().default(1).describe('Scale factor for high resolution (default: 1 for 1x resolution)'),
    },
    async ({ svg, width, height, scale }) => {
      try {
        // Validate SVG content
        if (!svg.trim().startsWith('<svg') && !svg.trim().startsWith('<?xml')) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Invalid SVG content. SVG must start with <svg or <?xml'
            }],
            isError: true
          };
        }

        // Convert SVG string to buffer
        const svgBuffer = Buffer.from(svg, 'utf-8');

        // Convert SVG to PNG using sharp
        const pngBuffer = await sharp(svgBuffer)
          .resize(width! * scale!, height! * scale!, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();

        // Convert to base64
        const base64Image = pngBuffer.toString('base64');

        return {
          content: [{
            type: 'image',
            data: base64Image,
            mimeType: 'image/png'
          }],
          isError: false
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error converting SVG: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  );

  mcpServer.tool(
    'svg_preview_file',
    'Convert SVG file path to high-resolution PNG image',
    {
      filePath: z.string().describe('Path to SVG file'),
      width: z.number().optional().default(1920).describe('Width of the output image in pixels (default: 1920)'),
      height: z.number().optional().default(1080).describe('Height of the output image in pixels (default: 1080)'),
      scale: z.number().optional().default(2).describe('Scale factor for high resolution (default: 2 for 2x resolution)'),
    },
    async ({ filePath, width, height, scale }) => {
      try {
        // Use sharp to read and convert SVG file
        const buffer = await sharp(filePath)
          .resize(width! * scale!, height! * scale!, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();

        const base64Image = buffer.toString('base64');

        return {
          content: [{
            type: 'image',
            data: base64Image,
            mimeType: 'image/png'
          }],
          isError: false
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error converting SVG file: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  );

  return mcpServer;
}