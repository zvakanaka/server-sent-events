const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

function sseDemo(req, res) {
  console.log('Writing data every second until close...')
  let messageId = 0;

  const intervalId = setInterval(() => {
    res.write(`id: ${messageId}\n`);
    res.write(`data: Example (${Date.now()})\n\n`);
    messageId += 1;
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
    console.log('Closed.')
  });
}

app.get('/event-stream', (req, res) => {
  // SSE Setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  sseDemo(req, res);
});
app.get('/', (req, res) => {
  res.send(`
  <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<ul>
  <li>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource">EventSource (MDN)</a>
  </li>
  <li>
    <a href="https://jasonbutz.info/2018/08/server-sent-events-with-node">Server-Sent Events With Node - Jason Butz</a>
  </li>
</ul>  

<ul></ul>  
  <script>
  var evtSource = new EventSource('event-stream');
var eventList = document.querySelector('ul');

evtSource.onmessage = function(e) {
  var newElement = document.createElement("li");

  newElement.textContent = "message: " + e.data;
  eventList.appendChild(newElement);
}

</script>
</body>
</html>
`);
})

app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`)
