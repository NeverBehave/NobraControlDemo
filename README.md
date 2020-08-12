# Nobra Control Demo

## Background

I have tried [intiface](https://github.com/intiface/intiface-desktop) (config added), and [noble](https://github.com/noble/noble) directly, but no luck. Both of them cannot found the device.

It turns out that Nobra Digital Control Box is BTClassic, Oops. Currently, https://buttplug.io does not support such protocal.

## Get started

Notice: the library [node-bluetooth-serial-port](https://github.com/eelcocramer/node-bluetooth-serial-port) only works on Node.js ~12, higher version will report errors when compiling.

### Install

```bash
yarn
```

### Run

```bash
yarn start
```

It should automatcally search for device and try connecting it. 

There will be an interactive shell allows you to type in command (0-15, e for exit)


## Note

- Tested on Manjaro 20.0.3 Lysia
