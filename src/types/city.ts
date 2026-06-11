export type FrictionLevel = "high" | "medium" | "low";
export type HeatRisk = "high" | "medium" | "low";
export type AlertSeverity = "high" | "medium" | "low";

export interface TransportOption {
  mode: string;
  frictionLevel: FrictionLevel;
  warning: string;
  action: string;
}

export interface Match {
  id: string;
  stage: string;
  date: string;
  time: string;
  timezone: string;
  home: string;
  away: string;
  confirmed: boolean;
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

export interface StadiumRules {
  bagPolicy: string;
  prohibitedItems: string[];
  idRequired: string;
  cashless: boolean;
  alcoholPolicy: string;
  foodPolicy: string;
}

export interface StadiumFood {
  options: string[];
  paymentMethods: string[];
  notes: string;
}

export interface QueueTimes {
  recommendedArrival: string;
  gateOpenTime: string;
  estimatedQueueWait: string;
  source: string;
}

export interface PostMatchInfo {
  estimatedExitTime: string;
  transportWaitEstimate: string;
  drivingExitAdvice: string;
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
  matches: Match[];
  transportOptions: TransportOption[];
  hotelZones: HotelZone[];
  dynamicFields: CityDynamicFields;
  stadiumRules: StadiumRules;
  stadiumFood: StadiumFood;
  queueTimes: QueueTimes;
  postMatchInfo: PostMatchInfo;
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
