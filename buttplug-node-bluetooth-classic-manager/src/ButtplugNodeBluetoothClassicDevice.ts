/*!
 * Buttplug JS Source Code File - Visit https://buttplug.io for more info about
 * the project. Licensed under the BSD 3-Clause license. See LICENSE file in the
 * project root for full license information.
 *
 * @copyright Copyright (c) Nonpolynomial Labs LLC. All rights reserved.
 */
import { ButtplugDeviceImpl,
         ButtplugDeviceWriteOptions, ButtplugDeviceReadOptions, ButtplugDeviceException, Endpoints } from "buttplug";

const retry = function (cont, fn) {
  return fn().catch(function (err) {
      return cont > 0 ? function () {
          return retry(cont - 1, fn);
      } : Promise.reject(err);
  });
};
         
export class ButtplugNodeBluetoothClassicDevice extends ButtplugDeviceImpl {
  WriteValueInternal(aValue: Buffer, aOptions: ButtplugDeviceWriteOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.btSerial.write(aValue, function(err, bytesWritten) {
        if (err) reject(err);
        else resolve(bytesWritten)
      });
    })
  }

  private buf: Buffer = Buffer.from('');
  private btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

  ReadValueInternal(aOptions: ButtplugDeviceReadOptions): Promise<Buffer> {
    const p = (resolve, reject) => {
      let time = 0
      const interval = setInterval(() => {
        if (this.buf && this.buf.byteLength >= aOptions.ReadLength) {
          clearInterval(interval)
          const temp = this.buf  
          this.buf = Buffer.from('')
          resolve(temp)
        } else if (time > aOptions.Timeout) {
          clearInterval(interval)
          reject(this.buf)
        }
        time += 1000
      }, 1000)
    }
    return new Promise(p)
  }

  SubscribeToUpdatesInternal(aOptions: ButtplugDeviceReadOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public get Connected(): boolean {
    return this.btSerial.isOpen();
  }

  public constructor(_deviceInfo: { name: string, address: string }) {
    super(_deviceInfo.name, _deviceInfo.address);
    this.btSerial.on('data', (buffer) => {
      this._logger.Debug(`[Connecting] try connecting`)
      this.buf = Buffer.concat([buffer, this.buf])
    });
  }

  private searchChannel = async (address) => {
    return new Promise((resolve, reject) => {
        this.btSerial.findSerialPortChannel(address, (channel) => resolve(channel), () => reject(new ButtplugDeviceException("[Connecting] found nothing")))
    })
  }

  private connect = async (address, channel) => {
    return new Promise((resolve, reject) => {
        this.btSerial.connect(address, channel, () => resolve(), () => reject(new ButtplugDeviceException("[Disconnected] cannot connect")))
      })
  }

  private async verify() {
    this._logger.Info("[Verification] Ping...")
    await this.WriteValueInternal(Buffer.from('A', 'utf-8'), {
      WriteWithResponse: false,
      Endpoint: Endpoints.Tx
    })
    const str = await this.ReadString({
      Timeout: 3000,
      ReadLength: 5,
      Endpoint: Endpoints.Tx
    }).catch(e => {
        throw new ButtplugDeviceException(`[Verification] Failed to receive string in given time frame`)
    })
    if (str.indexOf('NoBra') === -1) {
        throw new ButtplugDeviceException(`[Verification] String mismatch${str}`)
    } 

    return str
  }

  private verification = async () => {
    return retry(5, this.verify)
  }

  public Connect = async (): Promise<void> => {
    const channel = await this.searchChannel(this.Address)
    this._logger.Debug(`[Connecting] try connecting`)
    await this.connect(this.Address, channel)
    if (this.btSerial.isOpen()) {
      this._logger.Info('[Not-Verified] Connected, try verifing device: is it a nobra control?');
      await this.verification()
      this._logger.Info(`[Connected] verified! Hi, Nobra`)
    } else {
      throw new ButtplugDeviceException('[Disconnected] Failed to connect to device')
    }
  }

  public Disconnect = async (): Promise<void> => {
    this.btSerial.close()
    this.emit("deviceremoved");
  }

}
