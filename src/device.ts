export class Device {

    public width: number;
    public height: number;
    public scaleFactor: number;

    public static init = (window: Window): Device => {
        let device = new Device();

        device.width = window.innerWidth;
        device.height = window.innerHeight;
        device.scaleFactor = device.width / device.height;

        return device;
    }
}