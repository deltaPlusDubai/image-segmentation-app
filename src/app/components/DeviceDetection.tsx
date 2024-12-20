import DeviceDetector from "device-detector-js";

export default function DeviceDetection({ supportedDevices }: any) {
  const testSupport = () => {
    const deviceDetector = new DeviceDetector();
    const detectedDevice = deviceDetector.parse(navigator.userAgent);

    let isSupported = false;
    for (const device of supportedDevices) {
      if (device.client) {
        const re = new RegExp(`^${device.client}$`);
        if (!re.test(detectedDevice.client?.name || "")) {
          continue;
        }
      }
      isSupported = true;
      break;
    }

    if (!isSupported) {
      alert(
        `This demo, running on ${detectedDevice.client?.name}/${detectedDevice.os?.name}, ` +
          `is not well supported at this time, continue at your own risk.`
      );
    }
  };

  return null;
}
