import {
  record,
  str,
  num,
  flag,
  cycle,
  App,
  type Settings,
  type View,
  type HttpSpec,
} from "./lib.ts";

export class AppModel extends App {
  status: Settings = {};
  wifi: Settings = {};
  page = 0;
  poll = 0;
  request(_now: number): HttpSpec {
    const wireless = this.poll++ % 2 === 1;
    return {
      url: "http://localhost/api/" + (wireless ? "wifi/status" : "status"),
      kind: wireless ? "wifi" : "status",
    };
  }
  receive(value: unknown, now: number, kind?: string): void {
    const v = record(value);
    if (kind === "wifi") this.wifi = v;
    else {
      if (!v.power || !v.system || !v.firmware)
        throw new Error("Incomplete device status");
      this.status = v;
    }
    this.lastReceived = now;
    this.error = "";
  }
  key(key: string, delta: number, _now: number): boolean {
    if (key === "wheel" || key === "ok")
      this.page = cycle(
        this.page,
        key === "ok" ? 1 : delta,
        flag(this.settings, "show_serial") ? 4 : 3,
      );
    return false;
  }
  view(_now: number): View {
    const power = record(this.status.power),
      system = record(this.status.system),
      firmware = record(this.status.firmware),
      device = record(this.status.device);
    if (!this.lastReceived)
      return {
        title: "Device Dashboard",
        value: "LOADING",
        rows: [this.error],
      };
    if (this.page === 0)
      return {
        title: "Battery",
        value: num(power, "battery_charge") + "%",
        rows: [
          str(power, "state"),
          num(power, "battery_voltage") + " mV",
          num(power, "usb_voltage") + " mV USB",
        ],
        progress: num(power, "battery_charge") / 100,
      };
    if (this.page === 1)
      return {
        title: "Wi-Fi",
        value: str(
          this.wifi,
          "state",
          str(this.wifi, "status", "CHECKING"),
        ).toUpperCase(),
        rows: [
          str(this.wifi, "ssid"),
          str(
            record(this.wifi.ip_config),
            "address",
            str(this.wifi, "ip", str(this.wifi, "ip_address")),
          ),
          this.error,
        ],
      };
    if (this.page === 2)
      return {
        title: "Firmware",
        value: str(firmware, "version", "UNKNOWN"),
        rows: [
          "API " + str(system, "api_semver"),
          "Uptime " + str(system, "uptime"),
          str(firmware, "commit_hash"),
        ],
        hint: "Wheel / OK page",
      };
    return {
      title: "Device",
      value: str(device, "serial_number", "UNKNOWN"),
      rows: [str(device, "usb_mac"), str(device, "wifi_mac")],
      compact: true,
    };
  }
}
