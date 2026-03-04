// src/main.ts
import SoCalendar from "../src/js/soCalendar";
import "../src/scss/soCalendar.scss"

document.addEventListener('DOMContentLoaded', (event) => {

  const calendar = new SoCalendar();
  calendar.init();
  calendar.init('#fr-date', { locale:'fr-FR' });
  calendar.init('#us-date', { locale:'en-US', dateFormat: "MM/DD/YYYY" });
  calendar.init('#pl-date', { locale:'pl-PL', dateFormat: "YYYY/MM/DD" });

  // Apply soCalendar to `#empty-date-with-min-max` and apply a minDate value of 1 month ago
  const now = new Date();
  const oneMonthAgo = new Date();
  const oneMonthFromNow = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  oneMonthFromNow.setMonth(now.getMonth() + 1);
  calendar.init('#empty-date-with-min-max', { minDate: oneMonthAgo, maxDate: oneMonthFromNow });
  const dateWithMinMax = document.getElementById('empty-date-with-min-max');
  const parent = dateWithMinMax?.closest('.input-wrap');
  if (parent) parent.insertAdjacentHTML('afterend', `<strong>Min:</strong> ${oneMonthAgo}<br/><strong>Max:</strong> ${oneMonthFromNow}`);
});