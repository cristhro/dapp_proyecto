

const getStatusFormatted = (projectStatus) => {
  switch (+projectStatus) {
    case 0:
      return "Active";
    case 1:
      return "Pause";
    case 2:
      return "Complete";
    default:
      return "Unknown";
  }
}
 

export { getStatusFormatted };
