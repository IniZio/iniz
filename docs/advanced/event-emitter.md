# Event Emitter

Reim store is an [Event Emitter](https://www.npmjs.com/package/event-emitter), so you can freely use it for handling events

```javascript
const emitter = store({})

emitter.on('test', () => {
  // … react to 'test' event
});
 
emitter.once('test', (...args) => {
  // … react to first 'test' event (invoked only once!)
});
 
emitter.emit('test', arg1, arg2/*…args*/); // Two above listeners invoked
emitter.emit('test', arg1, arg2/*…args*/); // Only first listener invoked
 
emitter.off('test', listener);              // Removed first listener
emitter.emit('test', arg1, arg2/*…args*/); // No listeners invoked
```



