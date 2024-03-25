const getCurrentSemesterAndYear = require("../utils/handleCurrent");

function isPastSemester(semester, year) {
  const { currentSemester, currentYear } = getCurrentSemesterAndYear();

  if (year < currentYear) {
    return true;
  } else if (year === currentYear) {
    const semesterOrder = { Spring: 1, Summer: 2, Fall: 3 };
    return semesterOrder[semester] < semesterOrder[currentSemester];
  }
  return false;
}

module.exports = isPastSemester;
