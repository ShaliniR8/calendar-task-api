export const groupTasksByMonth = (tasks) => {
    const grouped = {};
    tasks.forEach((task) => {
      const month = new Date(task.datetime).toLocaleString("default", { month: "long", year: "numeric" });
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(task);
    });
    return grouped;
  };
  