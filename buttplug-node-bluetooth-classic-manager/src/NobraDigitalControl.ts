import { IButtplugDeviceImpl, ButtplugDeviceProtocol, ButtplugDeviceException, ButtplugMessageException } from "buttplug";
import {
  SingleMotorVibrateCmd,
  StopDeviceCmd,
  VibrateCmd,
  ButtplugMessage,
  Ok
} from "buttplug";

export class NobraDigitalControl extends ButtplugDeviceProtocol {
    private _currentStage: number = 0;
    private _allStages = ['p', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
    private _rebootChar = 'F'
    private _maxStage = 15;
    private _minStage = 0;

    public constructor(aDeviceImpl: IButtplugDeviceImpl) {
      super(`NobraDigitalControl ${aDeviceImpl.Name}` , aDeviceImpl);
      this.msgReg.set('StopDeviceCmd', this.HandleStopDeviceCmd);
      this.msgReg.set('SingleMotorVibrateCmd', this.HandleSingleMotorVibrateCmd);
      this.msgReg.set('VibrateCmd', this.HandleVibrateCmd);
    }
  
    // I give up, possibly double import causes this issue, class function won't match, but their name are  the same.
    private msgReg = new Map<string, Function>();

    public ParseMessage = async (aMsg: ButtplugMessage): Promise<ButtplugMessage> => {
      if (!this.msgReg.has(aMsg.Type.name)) {
        throw new ButtplugMessageException(`${this._name} cannot handle message of type ${aMsg.Type.name}`, aMsg.Id);
      }
      // Non-null assurance in the middle of functions looks weird.
      return this.msgReg.get(aMsg.Type.name)!(aMsg);
    }
  
    public get MessageSpecifications(): object {
      return {
        VibrateCmd: { FeatureCount: 1},
        SingleMotorVibrateCmd: { FeatureCount: 1 },
        StopDeviceCmd: { FeatureCount: 1 },
      };
    }
  
    private HandleVibrateCmd = async (aMsg: VibrateCmd): Promise<ButtplugMessage> => {
      if (aMsg.Speeds.length !== 1) {
        throw new ButtplugDeviceException(`Nobra Control require VibrateCmd to have 1 speed command, ` +
                                          `${aMsg.Speeds.length} sent.`,
                                          aMsg.Id);
      }
      return this.HandleSingleMotorVibrateCmd(new SingleMotorVibrateCmd(aMsg.Speeds[0].Speed,
                                                                                       aMsg.DeviceIndex,
                                                                                       aMsg.Id));
    }
  
    private HandleStopDeviceCmd = async (aMsg: StopDeviceCmd): Promise<ButtplugMessage> => {
      return this.HandleSingleMotorVibrateCmd(new SingleMotorVibrateCmd(0, aMsg.DeviceIndex, aMsg.Id));
    }
  
    private HandleSingleMotorVibrateCmd =
      async (aMsg: SingleMotorVibrateCmd): Promise<ButtplugMessage> => {
          const speed = Math.round(aMsg.Speed * this._maxStage)
          if (this._currentStage !== speed) {
            this._currentStage = speed;
            this._logger.Debug(`[Sending] ${speed}(${aMsg.Speed})`)
            await this._device.WriteString(this._allStages[speed]);
          }
          return new Ok(aMsg.Id)
      }
}