import { type NextRequest } from 'next/server';
import { candidatesStore } from '~/lib/candidatesStore';

export async function GET(request: NextRequest) {
  // Set up SSE headers
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const initialData = {
        type: 'candidates-updated',
        data: candidatesStore.getAllCandidates()
      };
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
      );

      // Subscribe to updates
      const unsubscribe = candidatesStore.subscribe((candidates) => {
        const eventData = {
          type: 'candidates-updated',
          data: candidates
        };
        
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`)
          );
        } catch {
          console.error('Error sending SSE message');
        }
      });

      // Handle client disconnect
      const cleanup = () => {
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Controller might already be closed
        }
      };

      // Set up cleanup on request abort
      if (request.signal) {
        request.signal.addEventListener('abort', cleanup);
      }

      // Also set up periodic ping to keep connection alive
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
          cleanup();
        }
      }, 30000); // ping every 30 seconds

      // Cleanup on stream close
      const originalClose = controller.close.bind(controller);
      controller.close = () => {
        clearInterval(pingInterval);
        unsubscribe();
        originalClose();
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 