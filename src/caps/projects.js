export const fakeProjects = [
  {
    ProjectId: 1,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Hello world"
  },
  {
    ProjectId: 2,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Todo list"
  },
  {
    ProjectId: 3,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Foo Bar"
  },
  {
    ProjectId: 4,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Half-life 3"
  },
  {
    ProjectId: 5,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Microsoft"
  },
  {
    ProjectId: 6,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Super Project"
  },
  {
    ProjectId: 7,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Site"
  },
  {
    ProjectId: 8,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Application"
  },
  {
    ProjectId: 9,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Project 1"
  },
  {
    ProjectId: 10,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Project 2"
  },
  {
    ProjectId: 11,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Foo Bar 1"
  },
  {
    ProjectId: 12,
    ProjectStatus: 1,
    PhotoUri: "",
    Name: "Half-life 4"
  }
];

export const getRandomProjects = (amount) => {
  const projects = fakeProjects;
  projects.sort(() => Math.random() - 0.5)
  return projects.slice(0, amount);
};