# Nobra Control Demo

## Background

I have tried [intiface](https://github.com/intiface/intiface-desktop) (config added), and [noble](https://github.com/noble/noble) directly, but no luck. Both of them cannot found the device.

It turns out that Nobra Digital Control Box is BTClassic, Oops. Currently, https://buttplug.io does not support such protocal.

## Get started

Notice: 

- the library [node-bluetooth-serial-port](https://github.com/eelcocramer/node-bluetooth-serial-port) only works on Node.js <12, higher version will report errors when compiling.
- Vue-cli does not work with Node.js 12

So if you want to set up the demo website, you should use Node.js 10. If only cli part, Node.js 12 should be fine.

### Install

```bash
yarn
```

### Run

It should automatcally search for device and try connecting it. 

Note: the library didn't handle close properly. **If the device cannot be found(usually in 30s when device is discoverable), try toggling the bluetooth switch to release the previous connection.** 

Since this is just a demo, plz forgive unhandled Exception :(
    
**Most of the time you may need to manually kill node, `killall node`, since the library `inquire()` is still scanning device at the backend. This behavior cannot be stopped via current API.**

#### commandline mode

```bash
yarn commandLine
```

There will be an interactive shell allows you to type in command (0-15, e for exit)

#### Website
```bash
yarn dev
```

Check console for website (usually http://localhost:8080)

You may use it in LAN as well (there should be another address listed)

Please press check button to check if it is ready. 

#### API

```bash
yarn websocket
```

##### API docs

###### Status

> Request
```json
{ "command" : 0, "data": "" }
```

> Response
```json
{ "command" : 0, "status": true/false }
```

###### Level

> Request: data should be in range 0-15
```json
{ "command" : 1, "data": "0" }
```

> Response
No response if success, or 

```json
{ "status": false, "message": "{Error Message}"}
```


## Note

- Tested on Manjaro 20.0.3 Lysia
