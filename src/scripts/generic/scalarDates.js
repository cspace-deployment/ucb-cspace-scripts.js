/**
 * Calculate scalar date values from structured date parts, with the algorithm used by the
 * CollectionSpace UI.
 *
 * Structured dates are read from standard input, in CSV format. A header row is required.
 *
 * Structured dates are written to standard output, in CSV format. The output structured dates will
 * have the earliest and latest scalar date values set. If earliest/latest scalar dates are present
 * in the input, they will be overwritten.
 *
 * Example:
 * cat input.csv | node lib/scripts/generic/scalarDates.js > output.csv
 */

import parse from 'csv-parse';
import transform from 'stream-transform';
import stringify from 'csv-stringify';

import {
  computeEarliestScalarDate,
  computeLatestScalarDate,
} from 'cspace-input/lib/helpers/dateHelpers';

const propertyNames = {
  datedisplaydate: 'dateDisplayDate',
  dateperiod: 'datePeriod',
  dateassociation: 'dateAssociation',
  datenote: 'dateNote',
  dateearliestsingleyear: 'dateEarliestSingleYear',
  dateearliestsinglemonth: 'dateEarliestSingleMonth',
  dateearliestsingleday: 'dateEarliestSingleDay',
  dateearliestsingleera: 'dateEarliestSingleEra',
  dateearliestsinglecertainty: 'dateEarliestSingleCertainty',
  dateearliestsinglequalifier: 'dateEarliestSingleQualifier',
  dateearliestsinglequalifiervalue: 'dateEarliestSingleQualifierValue',
  dateearliestsinglequalifierunit: 'dateEarliestSingleQualifierUnit',
  datelatestyear: 'dateLatestYear',
  datelatestmonth: 'dateLatestMonth',
  datelatestday: 'dateLatestDay',
  datelatestera: 'dateLatestEra',
  datelatestcertainty: 'dateLatestCertainty',
  datelatestqualifier: 'dateLatestQualifier',
  datelatestqualifiervalue: 'dateLatestQualifierValue',
  datelatestqualifierunit: 'dateLatestQualifierUnit',
  dateearliestscalarvalue: 'dateEarliestScalarValue',
  datelatestscalarvalue: 'dateLatestScalarValue',
};

const columns = {};

const parser = parse({
  columns: header => header.map((columnName) => {
    const propertyName = propertyNames[columnName.toLowerCase()];

    columns[propertyName] = columnName;

    return propertyName;
  }),
  skip_empty_lines: true,
});

const transformer = transform(structuredDate => Object.assign(structuredDate, {
  dateEarliestScalarValue: computeEarliestScalarDate(structuredDate),
  dateLatestScalarValue: computeLatestScalarDate(structuredDate),
}));

const stringifier = stringify({
  columns,
  header: true,
});

process.stdin
  .pipe(parser)
  .pipe(transformer)
  .pipe(stringifier)
  .pipe(process.stdout);
