# scalarDates.js

Calculate scalar date values from structured date parts, with the algorithm used by the CollectionSpace UI.

Structured dates are read from standard input, in CSV format. A header row is required.

Structured dates are written to standard output, in CSV format. The output structured dates will have the earliest and latest scalar date values set. If earliest/latest scalar dates are present in the input, they will be replaced.

## Example

The command:

```
cat input.csv | node lib/scripts/generic/scalarDates.js > output.csv
```

For the input file:

```
datedisplaydate,dateearliestsingleday,dateearliestsinglemonth,dateearliestsingleyear,dateearliestsingleera,datelatestday,datelatestmonth,datelatestyear,datelatestera,dateearliestscalarvalue,datelatestscalarvalue
1000 -1300 AD,1,1,1000,ce,31,12,1300,ce,,
1000-500 BC,1,1,1000,bce,31,12,500,bce,,
```

Produces the output:

```
datedisplaydate,dateearliestsingleday,dateearliestsinglemonth,dateearliestsingleyear,dateearliestsingleera,datelatestday,datelatestmonth,datelatestyear,datelatestera,dateearliestscalarvalue,datelatestscalarvalue
1000 -1300 AD,1,1,1000,ce,31,12,1300,ce,1000-01-01,1301-01-01
1000-500 BC,1,1,1000,bce,31,12,500,bce,1000-01-01,0501-01-01
```