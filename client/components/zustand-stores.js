import { create } from "zustand";

export const useStationsStore = create((set) => ({
  stations: [],
  updateStations: (newStationsArray) => set({ stations: newStationsArray }),
  clearStations: () => set({ stations: [] }),
}));

// export const useDiscoveryVenueStore = create((set) => ({
//   discoveryVenue: [],
//   updateDiscoveryVenue: (newDiscoveryVenue) =>
//     set({ discoveryVenue: newDiscoveryVenue }),
// }));

export const useSuccessfulVisitStore = create((set) => ({
  visitedStations_client: [],
  visitedVenues_client: [],
  updateVisitedVenues_client: (newVisitedVenues) =>
    set({ visitedVenues_client: newVisitedVenues }),
  updateVisitedStations_client: (newVisitedStations) =>
    set({ visitedStations_client: newVisitedStations }),
}));

export const useDiscoveryVenueStore = create((set) => ({
  discoveryVenues: [],
  updateDiscoveryVenues: (newDiscoveryVenue) =>
    set({ discoveryVenues: newDiscoveryVenue }),
}));
export const useDiscoveryStationStore = create((set) => ({
  discoveryStation: [],
  updateDiscoveryStation: (newDiscoveryStation) =>
    set({ discoveryStation: newDiscoveryStation }),
}));

export const useStreakStore = create((set) => ({
  streak: 0,
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak + 1,
    })),
  clearStreak: () => set({ streak: 0 }),
}));

export const useLineStore = create((set) => ({
  line: "bakerloo",
  updateActiveLine: (newLine) => set({ line: newLine }),
}));

export const useCompletionStore = create((set) => ({
  percentage: 0,
  increasePercentage: () =>
    set((state) => ({ percentage: state.percentage + 1 })),
  clearPercentage: () => set({ percentage: 0 }),
  updatePercentage: (newPercentage) => set({ percentage: newPercentage }),
}));
