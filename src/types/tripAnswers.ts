export type LocalConfidence = "low" | "med" | "high";

export type StayLocation =
  | "Near stadium"
  | "City center / downtown"
  | "Near airport"
  | "Suburb / outside city"
  | "Not booked yet"
  | "Not sure";

export type StadiumTransit =
  | "Public transit"
  | "Rideshare"
  | "Official shuttle"
  | "Driving"
  | "Private transfer"
  | "Not sure yet";

export interface CityLogistics {
  stayLocation: StayLocation;
  stadiumTransit: StadiumTransit;
  localConfidence: LocalConfidence;
}

export interface TripAnswers {
  hostCities: string[];
  cityDetails: Record<string, CityLogistics>;
  visitingFromAbroad: boolean;
  crossingBorders: boolean;
  drivingVehicle: boolean;
  generatedAt: string;
}
