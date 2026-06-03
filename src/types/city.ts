export type FrictionLevel = "high" | "medium" | "low";
export type HeatRisk = "high" | "medium" | "low";
export type AlertSeverity = "high" | "medium" | "low";

export interface TransportOption {
  mode: string;
  frictionLevel: FrictionLevel;
  warning: string;
  action: string;
}

export interface HotelZone {
  zone: string;
  pros: string;
  risks: string;
  action: string;
}

export interface CityDynamicFields {
  shuttleLink: string | null;
  shuttleStatus: string | null;
  bagPolicy: string;
  bagPolicyLink: string | null;
  transportLink: string | null;
  officialCityLink: string | null;
  lastUpdated: string;
  alerts: unknown[];
}

export interface City {
  id: string;
  name: string;
  stadium: string;
  frictionIndex: number;
  primaryFriction: string;
  distanceMiles: number;
  infographicCaption: string;
  downtownCode: string;
  stadiumCode: string;
  advisory: string;
  stadiumReality: string;
  heatRisk: HeatRisk;
  heatCopy: string;
  transitType: string;
  drivingRisk: string;
  matchDays: string[];
  transportOptions: TransportOption[];
  hotelZones: HotelZone[];
  dynamicFields: CityDynamicFields;
}

export interface GlobalAlert {
  text: string;
  severity: AlertSeverity;
  active: boolean;
}

export interface CityAlert {
  text: string;
  alertType: string;
  severity: AlertSeverity;
  active: boolean;
}
