import {developers, projects} from "./data";

export const getRandomDevelopers = (amount) => {
  const developersCopy = developers;
  developersCopy.sort(() => Math.random() - 0.5);
  return developersCopy.slice(0, amount);
};

export const getRandomProjects = (amount) => {
  const projectsCopy = projects;
  projectsCopy.sort(() => Math.random() - 0.5);
  return projectsCopy.slice(0, amount);
};

