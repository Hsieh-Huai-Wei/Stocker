if (isNaN(userSearch.startDate) && isNaN(userSearch.endDate)) {
  let endString = moment().format("YYYY/MM/DD"); //string
  let end = endString.split('/')[0] + endString.split('/')[1] + endString.split('/')[2]
  const start = moment([endString]).subtract(33, "days").format("YYYYMMDD");
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);

} else if (isNaN(userSearch.startDate) && !(isNaN(userSearch.endDate))) {
  const end = userSearch.endDate
  const endString = end.toString()
  let endcount = endString[0] + endString[1] + endString[2] + endString[3] + '/' + endString[4] + endString[5] + '/' + endString[6] + endString[7]

  const start = moment([endcount]).subtract(63, "days").format("YYYYMMDD");
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
} else if (!(isNaN(userSearch.startDate)) && isNaN(userSearch.endDate)) {
  const endString = moment().format("YYYYMMDD"); //string
  const end = Number(endString)
  const startUser = userSearch.startDate
  const startSting = startUser.toString();
  let startcount = startSting[0] + startSting[1] + startSting[2] + startSting[3] + '/' + startSting[4] + startSting[5] + '/' + startSting[6] + startSting[7];
  const start = Number(moment([startcount]).add(-28, "days").format("YYYYMMDD"));
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
} else {
  const startUser = userSearch.startDate
  const startSting = startUser.toString();
  let startcount = startSting[0] + startSting[1] + startSting[2] + startSting[3] + '/' + startSting[4] + startSting[5] + '/' + startSting[6] + startSting[7];
  const start = Number(moment([startcount]).add(-28, "days").format("YYYYMMDD"));
  const end = userSearch.endDate
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
}