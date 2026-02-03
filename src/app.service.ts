import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trackly API</title>
        <style>
          :root {
            --primary-color: #6366f1;
            --secondary-color: #4f46e5;
            --background-color: #f3f4f6;
            --text-color: #1f2937;
            --card-bg: #ffffff;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: var(--card-bg);
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          h1 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 2.25rem;
            font-weight: 700;
          }
          p {
            margin-bottom: 2rem;
            line-height: 1.6;
            color: #4b5563;
          }
          .btn {
            display: inline-block;
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.3s ease;
          }
          .btn:hover {
            background-color: var(--secondary-color);
          }
          .status {
            margin-top: 1.5rem;
            font-size: 0.875rem;
            color: #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1>Trackly API</h1>
          <p>Welcome to the Trackly API server. The system is up and running.</p>
          <a href="/api/docs" class="btn">View Documentation</a>
          <div class="status">
            <span class="status-dot"></span>
            Server Operational
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
