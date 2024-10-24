import { NextResponse } from 'next/server';
import { scrapeMultiplePages } from '@/lib/scraper';
import { connectToDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const config = await request.json();
  const taskId = uuidv4();
  console.log(`Received scrape request for task ${taskId} with config:`, config);

  const encoder = new TextEncoder();
  // Create a readable stream for SSE (Server-Sent Events)
  const stream = new ReadableStream({
    async start(controller) {
      // Send the task ID to the client
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ taskId })}\n\n`));

      try {
        // Perform scraping and send progress updates
        const machines = await scrapeMultiplePages(config, (progress) => {
          console.log(`Sending progress update: ${progress}`);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress })}\n\n`));
        });

        console.log(`Scraping completed. Total items scraped: ${machines.length}`);
        // Store scraped data in database
        const db = await connectToDatabase();
        const collection = db.collection('machines');
        const result = await collection.insertMany(machines);

        console.log(`Inserted ${result.insertedCount} items into database`);

        // Send final response to client
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          success: true, 
          data: machines, 
          insertedCount: result.insertedCount,
          totalPages: Math.ceil(machines.length / (config.pages || 1))
        })}\n\n`));
      } catch (error) {
        console.error('Error during scrape:', error);
        // Send error response to client
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: false, error: error.message })}\n\n`));
      } finally {
        // Close the stream
        controller.close();
      }
    }
  });
  // Return the stream as a SSEresponse
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

