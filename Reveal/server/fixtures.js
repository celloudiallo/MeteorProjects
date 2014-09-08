if (Contracts.find().count() === 0) {
  [
    {
      title: "Electrical Designer"
    },
    {
      title: "Senior Electrical Designer"
    },
    {
      title: "Principle Electrical Designer"
    },
    {
      title: "Project Engineer"
    },
    {
      title: "Fabricator"
    },
    {
      title: "Machinist"
    },
    {
      title: "Fitter"
    }
  ].forEach(function (obj) {
    Contracts.insert(obj);
});
}