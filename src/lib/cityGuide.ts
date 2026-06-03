import type { City, TransportOption } from "../types/city.ts";

export function frictionIndexTier(score: number): string {
  if (score >= 8.5) return "CRITICAL";
  if (score >= 7.5) return "SEVERE";
  if (score >= 6.5) return "ELEVATED";
  return "MODERATE";
}

export function displayCityShort(name: string): string {
  const slash = name.indexOf(" / ");
  return slash === -1 ? name : name.slice(0, slash);
}

export function displayCityArea(name: string): string {
  const slash = name.indexOf(" / ");
  return slash === -1 ? name.toUpperCase() : name.slice(slash + 3).toUpperCase();
}

export function intelligenceRef(city: City): string {
  return `${city.downtownCode}-2026-55`;
}

export function primaryFrictionBody(city: City): string {
  const transit = city.transportOptions.find((t) =>
    t.mode.toLowerCase().includes("public"),
  );
  if (transit?.warning) {
    return `The venue is geographically isolated from the regional core. ${transit.warning}`;
  }
  return city.stadiumReality;
}

export function venueLogisticsBody(city: City): string {
  const area = displayCityArea(city.name);
  const core = displayCityShort(city.name);
  const window =
    city.distanceMiles >= 20
      ? "90–120"
      : city.distanceMiles >= 12
        ? "60–90"
        : "45–60";

  if (city.name.includes(" / ")) {
    return `${area} is a distinct municipality from ${core}. Walking from any regional train station to the stadium is impractical across highway-heavy terrain. ${city.stadiumReality} Expect ${window} minute transit windows on matchday.`;
  }

  return `${city.stadiumReality} Expect ${window} minute transit windows on matchday when crowds peak.`;
}

export function securityAlertBody(city: City): string {
  const place = displayCityShort(city.name);
  return `${place} has historically seen high incidents of fraudulent "secondary market" street tickets for major events. Only use the official FIFA app for entry. Physical "souvenir" tickets sold outside are void.`;
}

export function geospatialRailLabel(city: City): string {
  const publicTransit = city.transportOptions.find((t) =>
    t.mode.toLowerCase().includes("public"),
  );
  if (!publicTransit) return "NO RAIL LINK";
  if (publicTransit.frictionLevel === "high") return "NO RAIL LINK";
  if (publicTransit.frictionLevel === "medium") return "LIMITED RAIL";
  return "RAIL AVAILABLE";
}

export function transportBadge(option: TransportOption): {
  text: string;
  variant: "recom" | "risk" | "neutral";
} {
  const mode = option.mode.toLowerCase();

  if (
    option.frictionLevel === "low" ||
    mode.includes("official") ||
    (mode.includes("shuttle") && option.frictionLevel !== "high")
  ) {
    return { text: "RECOM", variant: "recom" };
  }

  if (mode.includes("rideshare") && option.frictionLevel === "high") {
    return { text: "SURGE RISK: HIGH", variant: "risk" };
  }

  if (mode.includes("driving") || mode.includes("private")) {
    return { text: "PARKING RISK", variant: "risk" };
  }

  if (option.frictionLevel === "medium") {
    return { text: "CAUTION", variant: "neutral" };
  }

  return { text: "HIGH FRICTION", variant: "risk" };
}
