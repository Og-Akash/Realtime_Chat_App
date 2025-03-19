import { create } from "zustand";

export enum NavigationType {
  Contacts = "contacts",
  Search = "search",
  Assiestant = "assiestant",
}
export enum FilterType {
  Online = "online",
  Contacts = "contacts",
  NotContacts = "notcontacts",
  Groups = "groups",
}

type SidebarTypes = {
  navigation: NavigationType;
  currentFilter: FilterType | null;
  setNavigation: (navigation: NavigationType) => void;
  setFilter: (filterOption: FilterType) => void;
};

export const useSidebarStore = create<SidebarTypes>((set,get) => ({
  navigation: NavigationType.Contacts,
  currentFilter: null,
  setNavigation: (navigation: NavigationType) => set({ navigation }),
  setFilter: (filterOption: FilterType) =>
    set({
      currentFilter: filterOption === get().currentFilter ? null : filterOption,
    }),
}));
