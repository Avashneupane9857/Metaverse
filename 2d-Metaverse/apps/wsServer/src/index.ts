import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('close',()=>{
    console.log('Client disconnected');
  })
  ws.on('message',(data:string)=> {
    const message=JSON.parse(data.toString())
    switch(message.type){
        case "join":
            handleJoinEvent(message.payload)
            break
        case "movement":
           handleMovementEvent(message.payload)   
           break
        default:
            console.log('Unhandled event type:', message.type);

    }
    console.log('received: %s', message); 
    console.log('received: %s', data);
  });

  ws.send('something');
});

