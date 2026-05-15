import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env.local 등에서 VITE_ 접두사가 없는 환경변수도 불러옵니다.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-middleware',
        configureServer(server) {
          // 로컬 개발 서버(npm run dev)에서 /api/chat 경로를 직접 처리하도록 미들웨어 추가
          server.middlewares.use('/api/chat', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              
              req.on('end', async () => {
                try {
                  const { messages } = JSON.parse(body);
                  const apiKey = env.OPENAI_API_KEY;

                  if (!apiKey) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'OpenAI API key not configured' }));
                    return;
                  }

                  // OpenAI API로 직접 요청
                  const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                      model: 'gpt-4o-mini',
                      messages,
                    }),
                  });

                  const data = await response.json();
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (error) {
                  console.error('Local API Error:', error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
  }
})
