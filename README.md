# Nobra Control Demo

## Background

I have tried [intiface](https://github.com/intiface/intiface-desktop) (config added), and [noble](https://github.com/noble/noble) directly, but no luck. Both of them cannot found the device.

But at least I want to make a demo to see how well this could go, using a new library and here we go.

## Get started

Notice: the library using [node-bluetooth-serial-port](https://github.com/eelcocramer/node-bluetooth-serial-port) only works on Node.js ^12, higher version will report error when compile.

### Install

```bash
yarn
```

### Run

```bash
node index.js
```

It should automatcally search for device and try connecting it. 

There will be an interactive shell allows you to type in command (0-15, e for exit)


## Note

- Tested on Manjaro 20.0.3 Lysia
