const DAY_MS = 86_400_000;

function toLocalDate({ year, month, day }) {
  return new Date(year, month - 1, day);
}

function getDaysInYear(year) {
  return Math.round((new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / DAY_MS);
}

function dateToYearPercent(date) {
  const yearStart = new Date(date.year, 0, 1);
  const elapsedDays = Math.round((toLocalDate(date).getTime() - yearStart.getTime()) / DAY_MS);
  return (elapsedDays / (getDaysInYear(date.year) - 1)) * 100;
}

function isPastHalfOfYear(today) {
  return dateToYearPercent(today) > 50;
}

function getEntryEndDate(entry, today) {
  if (entry.endYear === null) {
    return today;
  }

  return {
    year: entry.endYear,
    month: entry.endMonth ?? 12,
    day: entry.endDay ?? 31,
  };
}

function getEntryStartDate(entry) {
  return {
    year: entry.startYear,
    month: entry.startMonth ?? 1,
    day: entry.startDay ?? 1,
  };
}

function getHighlightDate(highlight) {
  return {
    year: highlight.year,
    month: highlight.month ?? 1,
    day: highlight.day ?? 1,
  };
}

function hasScheduledContentInYear(entries, year, today) {
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year, 11, 31).getTime();

  return entries.some((entry) => {
    const startTime = toLocalDate(getEntryStartDate(entry)).getTime();
    const endTime = toLocalDate(getEntryEndDate(entry, today)).getTime();

    if (startTime <= yearEnd && endTime >= yearStart) {
      return true;
    }

    return entry.highlights?.some((highlight) => getHighlightDate(highlight).year === year) ?? false;
  });
}

function getLatestScheduledYear(entries, today, minimumEndYear) {
  const years = entries.flatMap((entry) => [
    entry.startYear,
    entry.endYear ?? today.year,
    ...(entry.highlights?.map((highlight) => getHighlightDate(highlight).year) ?? []),
  ]);

  return Math.max(minimumEndYear, today.year, ...years);
}

function getVisibleTimelineYears(entries, today, timelineStartYear, minimumEndYear) {
  const scheduledEndYear = getLatestScheduledYear(entries, today, minimumEndYear);
  const previewEndYear = isPastHalfOfYear(today) ? today.year + 1 : today.year;
  const timelineEndYear = Math.max(scheduledEndYear, previewEndYear);
  const years = [];

  for (let year = timelineStartYear; year <= timelineEndYear; year += 1) {
    years.push(year);
  }

  return years;
}

function getYearState(year, entries, today) {
  const hasContent = hasScheduledContentInYear(entries, year, today);
  const isFuture = year > today.year;
  const isPreview = isFuture && !hasContent;

  return {
    year,
    hasContent,
    isCurrent: year === today.year,
    isFuture,
    isPreview,
    isClickable: !isPreview && (year <= today.year || hasContent),
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const baseEntries = [
  {
    id: 'codexr',
    startYear: 2025,
    startMonth: 1,
    startDay: 14,
    endYear: null,
    highlights: [{ id: 'v120Release', year: 2026, month: 7, day: 30 }],
  },
  {
    id: 'masterTelecomUPM',
    startYear: 2026,
    startMonth: 9,
    startDay: 1,
    endYear: 2026,
    endMonth: 9,
    endDay: 1,
  },
];

const beforeHalf = { year: 2026, month: 6, day: 23 };
const afterHalf = { year: 2026, month: 7, day: 3 };
const nextYear = { year: 2027, month: 1, day: 10 };

assert(!getVisibleTimelineYears(baseEntries, beforeHalf, 2020, 2026).includes(2027), '2027 must not preview before half-year without scheduled content.');

const afterHalfYears = getVisibleTimelineYears(baseEntries, afterHalf, 2020, 2026);
assert(afterHalfYears.includes(2027), '2027 must preview after half-year.');
assert(getYearState(2027, baseEntries, afterHalf).isPreview, 'Preview 2027 must be marked as preview.');
assert(!getYearState(2027, baseEntries, afterHalf).isClickable, 'Preview 2027 must not be clickable without content.');

const planned2027Entries = [
  ...baseEntries,
  { id: 'future2027', startYear: 2027, startMonth: 3, startDay: 1, endYear: 2027, endMonth: 3, endDay: 1 },
];
assert(getVisibleTimelineYears(planned2027Entries, beforeHalf, 2020, 2026).includes(2027), 'Scheduled 2027 content must create 2027.');
assert(getYearState(2027, planned2027Entries, beforeHalf).isClickable, 'Scheduled 2027 must be clickable.');

const planned2028Entries = [
  ...baseEntries,
  { id: 'future2028', startYear: 2028, startMonth: 5, startDay: 1, endYear: 2028, endMonth: 5, endDay: 1 },
];
assert(getVisibleTimelineYears(planned2028Entries, beforeHalf, 2020, 2026).at(-1) === 2028, 'Timeline must grow through 2028 when 2028 is scheduled.');

assert(hasScheduledContentInYear(baseEntries, 2027, nextYear), 'Ongoing entries must occupy the current new year.');

console.log('Journey timeline checks passed.');
