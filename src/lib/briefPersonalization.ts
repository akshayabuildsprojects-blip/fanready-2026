import citiesData from "../data/cities.json";
import type { City, FrictionLevel } from "../types/city.ts";
import type { TripAnswers } from "../types/tripAnswers.ts";

const jsonCities = citiesData.cities as City[];

export const BRIEF_HOST_TO_JSON: Record<string, string> = {
  "new-york-nj": "nyc",
  "los-angeles": "losangeles",
  "kansas-city": "kansascity",
  dallas: "dallas",
  miami: "miami",
  atlanta: "atlanta",
  boston: "boston",
  houston: "houston",
  seattle: "seattle",
  philadelphia: "philadelphia",
};

const EXTRA_CITY_FALLBACKS: Record<
  string,
  Pick<City, "id" | "name" | "frictionIndex" | "stadiumReality" | "distanceMiles"> & {
    hostRegion: string;
    downtownArea: string;
    downtownVsBody: string;
  }
> = {
  "mexico-city": {
    id: "mexico-city",
    name: "Mexico City",
    frictionIndex: 7.4,
    distanceMiles: 12,
    hostRegion: "Valley of Mexico",
    downtownArea: "CENTRO",
    stadiumReality:
      "Estadio Azteca access depends on matchday shuttle corridors and limited rideshare pickup zones. Confirm official transit before matchday.",
    downtownVsBody:
      "Centro Histórico offers culture and dining but adds transfer time on matchday. Polanco and near-venue zones reduce egress friction at the cost of nightlife access.",
  },
  toronto: {
    id: "toronto",
    name: "Toronto",
    frictionIndex: 6.8,
    distanceMiles: 8,
    hostRegion: "Greater Toronto",
    downtownArea: "DOWNTOWN",
    stadiumReality:
      "BMO Field is reachable by streetcar and GO corridors, but post-match crowding compresses platform capacity. Plan exit buffers.",
    downtownVsBody:
      "Downtown keeps you on the subway grid. Liberty Village and Exhibition-adjacent stays shorten the final mile but spike pre-kickoff foot traffic.",
  },
  vancouver: {
    id: "vancouver",
    name: "Vancouver",
    frictionIndex: 6.5,
    distanceMiles: 6,
    hostRegion: "Lower Mainland",
    downtownArea: "DOWNTOWN",
    stadiumReality:
      "BC Place sits on the downtown peninsula with SkyTrain access, but Canada Line volumes after matches can exceed 45 minutes of platform wait.",
    downtownVsBody:
      "Downtown Vancouver minimizes transfers. Yaletown and Olympic Village zones trade nightlife density for shorter post-match walks.",
  },
};

const HOST_REGIONS: Record<string, string> = {
  dallas: "North Texas",
  boston: "Greater Boston",
  miami: "South Florida",
  nyc: "Metro New York",
  losangeles: "Greater Los Angeles",
  atlanta: "Metro Atlanta",
  kansascity: "Kansas City Metro",
  houston: "Greater Houston",
  seattle: "Pacific Northwest",
  philadelphia: "Greater Philadelphia",
};

export type TripComplexity = "high" | "medium" | "low";

export interface ResolvedCity {
  city: City;
  hostRegion: string;
  downtownArea: string;
  downtownVsBody: string;
}

function frictionToPercent(level: FrictionLevel | undefined): number {
  switch (level) {
    case "low":
      return 28;
    case "medium":
      return 52;
    case "high":
      return 88;
    default:
      return 60;
  }
}

function findTransport(city: City, keyword: string) {
  return city.transportOptions.find((t) =>
    t.mode.toLowerCase().includes(keyword.toLowerCase()),
  );
}

export function resolveBriefCities(
  selectedIds: string[],
  tripAnswers: TripAnswers | null,
): ResolvedCity[] {
  const rawIds =
    selectedIds.length > 0
      ? selectedIds.map((id) => BRIEF_HOST_TO_JSON[id] ?? id)
      : (tripAnswers?.hostCities
          .map((id) => BRIEF_HOST_TO_JSON[id] ?? id)
          .filter(Boolean) ?? []);

  const uniqueIds = [...new Set(rawIds)];

  return uniqueIds
    .map((id) => {
      const fromJson = jsonCities.find((c) => c.id === id);
      if (fromJson) {
        const slash = fromJson.name.indexOf(" / ");
        const downtownArea =
          slash === -1
            ? fromJson.downtownCode
            : fromJson.name.slice(slash + 3).toUpperCase();
        const downtownZone = fromJson.hotelZones[0];
        const suburbZone = fromJson.hotelZones[1];
        const downtownVsBody = suburbZone
          ? `Staying in ${downtownZone?.zone ?? "downtown"}: ${downtownZone?.pros ?? ""} Risks: ${downtownZone?.risks ?? ""} ${suburbZone.zone}: ${suburbZone.pros} Trade-off: ${suburbZone.risks}`
          : fromJson.advisory;

        return {
          city: fromJson,
          hostRegion: HOST_REGIONS[fromJson.id] ?? "Host Region",
          downtownArea,
          downtownVsBody,
        };
      }

      const extra = EXTRA_CITY_FALLBACKS[id];
      if (!extra) return null;

      const stub = {
        ...extra,
        stadium: "Host Stadium",
        primaryFriction: "Stadium access",
        infographicCaption: "",
        downtownCode: extra.downtownArea,
        stadiumCode: "STD",
        advisory: extra.stadiumReality,
        heatRisk: "medium" as const,
        heatCopy: "",
        transitType: "mixed",
        drivingRisk: "medium",
        matchDays: [],
        matches: [],
        transportOptions: [],
        hotelZones: [],
        dynamicFields: {
          shuttleLink: null,
          shuttleStatus: null,
          bagPolicy: "Check official stadium policy before matchday.",
          bagPolicyLink: null,
          transportLink: null,
          officialCityLink: null,
          lastUpdated: "",
          alerts: [],
        },
        stadiumRules: {
          bagPolicy: "Check official stadium policy before matchday.",
          prohibitedItems: [],
          idRequired: "Check official stadium policy before matchday.",
          cashless: true,
          alcoholPolicy: "Check official stadium policy before matchday.",
          foodPolicy: "Check official stadium policy before matchday.",
        },
        stadiumFood: {
          options: [],
          paymentMethods: [],
          notes: "Check official stadium policy before matchday.",
        },
        queueTimes: {
          recommendedArrival: "Verify closer to matchday.",
          gateOpenTime: "Verify closer to matchday.",
          estimatedQueueWait: "Verify closer to matchday.",
          source: "General stadium guidance. Verify closer to matchday.",
        },
        postMatchInfo: {
          estimatedExitTime: "Verify closer to matchday.",
          transportWaitEstimate: "Verify closer to matchday.",
          drivingExitAdvice: "Verify official post-match driving guidance.",
        },
      } satisfies City;

      return {
        city: stub,
        hostRegion: extra.hostRegion,
        downtownArea: extra.downtownArea,
        downtownVsBody: extra.downtownVsBody,
      };
    })
    .filter((entry): entry is ResolvedCity => entry !== null);
}

export function getTripComplexity(
  answers: TripAnswers,
  cityCount: number,
): TripComplexity {
  if (
    cityCount >= 3 ||
    (answers.visitingFromAbroad && answers.drivingVehicle)
  ) {
    return "high";
  }
  if (cityCount >= 2 || answers.visitingFromAbroad) {
    return "medium";
  }
  return "low";
}

export function getComplexitySummary(
  complexity: TripComplexity,
): string {
  if (complexity === "high") {
    return "Multi-city routing across varied climate zones requiring significant logistics management.";
  }
  if (complexity === "medium") {
    return "Moderate coordination across host regions with at least one cross-city or international constraint.";
  }
  return "Single-city focus with domestic movement assumptions and lower cross-border friction.";
}

export function getPrimaryRisks(
  answers: TripAnswers,
  resolved: ResolvedCity[],
): string[] {
  const risks = new Set<string>();

  if (resolved.some((r) => r.city.distanceMiles >= 15)) {
    risks.add("STADIUM DISTANCE");
  }
  if (
    resolved.some((r) => r.city.heatRisk === "high") ||
    resolved.some((r) => r.city.id === "miami" || r.city.id === "houston")
  ) {
    risks.add("HUMID HEAT INDEX");
  }
  if (
    resolved.some((r) => r.city.drivingRisk === "high") ||
    Object.values(answers.cityDetails ?? {}).some((details) =>
      details.stadiumTransit.toLowerCase().includes("rideshare"),
    )
  ) {
    risks.add("POST-MATCH EGRESS");
  }
  if (answers.crossingBorders) {
    risks.add("CROSS-BORDER TRANSIT");
  }
  if (answers.drivingVehicle) {
    risks.add("PARKING & TRAFFIC");
  }
  if (
    Object.values(answers.cityDetails ?? {}).some(
      (details) => details.localConfidence === "low",
    )
  ) {
    risks.add("LOCAL NAVIGATION");
  }
  if (resolved.length >= 2) {
    risks.add("TIME ZONE DRIFT");
  }

  if (risks.size === 0) {
    risks.add("MATCHDAY CROWDING");
  }

  return [...risks].slice(0, 5);
}

export function formatCityList(resolved: ResolvedCity[]): string {
  return resolved
    .map((r) => {
      const slash = r.city.name.indexOf(" / ");
      return slash === -1 ? r.city.name : r.city.name.slice(0, slash);
    })
    .join(", ");
}

export function getFrictionBars(city: City) {
  const walkability =
    city.distanceMiles >= 18
      ? 90
      : city.distanceMiles >= 12
        ? 70
        : city.distanceMiles >= 6
          ? 45
          : 25;

  const publicTransit = frictionToPercent(
    findTransport(city, "Public")?.frictionLevel,
  );
  const rideshare = frictionToPercent(
    findTransport(city, "Rideshare")?.frictionLevel,
  );
  const wait = Math.min(95, rideshare + 8);

  return { walkability, publicTransit, rideshare, wait };
}

export function getDistanceLabel(city: City): string {
  const km = Math.round(city.distanceMiles * 1.609);
  return `${city.distanceMiles} MILES / ${km} KM`;
}

export function displayCityShort(name: string): string {
  const slash = name.indexOf(" / ");
  return slash === -1 ? name : name.slice(0, slash);
}

export function checklistCities(resolved: ResolvedCity[]): string[] {
  return resolved.map((r) => displayCityShort(r.city.name));
}
