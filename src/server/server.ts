import * as express from 'express';
import { EVENT } from '../types'

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));

const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

interface IResponseUserInfo {
  name: string
  blog: string
  createdTime: number
}

const createStreamResponse = <T>(event: EVENT, data: T) => {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

app.get('/stream', (req, res, next) => {
  res.writeHead(200, SSE_RESPONSE_HEADER)
  res.write('\n');

  let i = 0;
  const id = setInterval(() => {
    i++;
    console.log('send message: ', i)

    if (i === 3) {
      res.write('retry: 500\ndata: Hello, I set the reconnection delay to 15 seconds\n\n')
    }

    // if (i === 10) {
    //   i = 0;
    //   res.end();
    // }

    if (i > 10) {
      res.write(createStreamResponse<IResponseUserInfo>('message', {
        name: 'hyunmo',
        blog: 'aaa',
        number: i,
        createdTime: Date.now()
      }))
    }

    res.write(createStreamResponse<IResponseUserInfo>(EVENT.USER_INFO, {
      name: 'jbee',
      blog: 'jbee.io',
      number: i,
      createdTime: Date.now()
    }))
  }, 1000)

  req.on('close', () => {
    console.log(`Close stream`)
    clearInterval(id)
  })
  req.on('end', () => {
    console.log(`End stream`)
  })
})

app.listen(port, () => console.log(`Server listening on port: ${port}`));
