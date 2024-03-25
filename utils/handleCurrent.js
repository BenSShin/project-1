function getCurrentSemesterAndYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  let currentSemester;
  if (currentMonth < 5) {
    currentSemester = "Spring";
  } else if (currentMonth < 8) {
    currentSemester = "Summer";
  } else {
    currentSemester = "Fall";
  }

  return { currentSemester, currentYear };
}

module.exports = getCurrentSemesterAndYear;
