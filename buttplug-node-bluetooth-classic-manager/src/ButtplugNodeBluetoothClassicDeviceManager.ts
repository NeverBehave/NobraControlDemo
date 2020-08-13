/*!
 * Buttplug JS Source Code File - Visit https://buttplug.io for more info about
 * the project. Licensed under the BSD 3-Clause license. See LICENSE file in the
 * project root for full license information.
 *
 * @copyright Copyright (c) Nonpolynomial Labs LLC. All rights reserved.
 */
import { IDeviceSubtypeManager, ButtplugLogger, ButtplugDevice, ButtplugDeviceException } from "buttplug";
import { EventEmitter } from "events";
import { ButtplugNodeBluetoothClassicDevice } from "./ButtplugNodeBluetoothClassicDevice";
import { NobraDigitalControl } from './NobraDigitalControl'

export class ButtplugNodeBluetoothClassicDeviceManager extends EventEmitter implements IDeviceSubtypeManager {

  private isScanning: boolean = false;
  // Set to default logger to make sure we have something at startup.
  private logger: ButtplugLogger = ButtplugLogger.Logger;
  private btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

  constructor() {
    super();
    this.btSerial.on('found', async (address, name) => {
      this.logger.Debug(`[Searching] Device Found: ${name}(${address})`)
        if (name.indexOf("Nobra Control") !== -1) {
          this.logger.Debug(`Hey, it looks like we got you:  ${name}(${address})`)
          await this.OpenDevice(name, address)
        }
    })
  }

  private OpenDevice = async (name, address) => {
    const bpDevImpl = new ButtplugNodeBluetoothClassicDevice({ name, address });
    try {
      await bpDevImpl.Connect() 
    } catch (e) {
      let errStr: string;
      switch (e) {
        case ButtplugDeviceException: {
          errStr = e.errorMessage;
          break;
        }
        case Error: {
          errStr = e.message;
          break;
        }
        default: {
          errStr = e
          break;
        }
      }
      this.logger.Error(`Error while connecting to ${name}: ${errStr}`);
      // We can't rethrow here, as this method is only called from an event
      // handler, so just return;
      return;
    }
    const bpProtocol = new NobraDigitalControl(bpDevImpl);
    const bpDevice = new ButtplugDevice(bpProtocol, bpDevImpl);
    try {
      await bpDevice.Initialize();
    } catch (e) {
      let errStr: string;
      switch (e) {
        case ButtplugDeviceException: {
          errStr = e.errorMessage;
          break;
        }
        case Error: {
          errStr = e.message;
          break;
        }
        default: {
          errStr = e
          break;
        }
      }
      this.logger.Error(`Error while initializing ${name}: ${errStr}`);
      // We can't rethrow here, as this method is only called from an event
      // handler, so just return.
      return;
    }
    this.emit("deviceadded", bpDevice);
  }

  public async StartScanning() {
    this.btSerial.inquire();
    this.isScanning = true;
  }

  public async StopScanning() {
    this.isScanning = false;
  }

  public get IsScanning(): boolean {
    return this.isScanning;
  }

  public SetLogger(aLogger: ButtplugLogger) {
    this.logger = aLogger;
  }
}
