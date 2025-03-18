import { create } from "zustand";

export enum NavigationType {
    Contacts = "contacts",
    Search = "search",
    Assiestant = "assiestant",
}

type SidebarTypes = {
    navigation: NavigationType;
    setNavigation: (navigation: NavigationType) => void;
}

export const useSidebarStore = create<SidebarTypes>((set) => ({
    navigation: NavigationType.Contacts,
    setNavigation: (navigation: NavigationType) => set({navigation}),
}))