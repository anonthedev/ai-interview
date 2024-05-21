import { create } from "zustand";

export const useJobDetails = create((set) => ({
  experience: "",
  domain: "",
  jobDesc: "",
  skills: "",
  resume: "",
  updateExp: (exp: string) => set({ experience: exp }),
  updateDomain: (domain: string) => set({ domain }),
  updateJobDesc: (jobDesc: string) => set({ jobDesc }),
  updateSkills: (skills: string) => set({ skills }),
  updateResume: (resume: string) => set({ resume }),
}));

export const useInterviewFlow = create((set) => ({
  interviewFlow: null,
  updateInterviewFlow: (flow: any) => set({ interviewFlow: flow }),
}));
