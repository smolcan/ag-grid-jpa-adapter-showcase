---
sidebar_position: 6
---

# Aggregation
Apply provided functions to values to calculate group values in the grid.

## Enabling Aggregation
To make column available for aggregation, set the `enableValue` parameter to `true` on `ColDef`,
otherwise aggregation attempt on this column will result to runtime exception.

To limit which aggregation functions ([AggregationFunction](https://github.com/smolcan/ag-grid-jpa-adapter/blob/main/src/main/java/io/github/smolcan/aggrid/jpa/adapter/request/AggregationFunction.java)) 
can be used on the column, provide array of allowed functions (otherwise all the aggregation functions are allowed.)

```java
ColDef priceColumn = ColDef.builder()
    .field("price")
    .enableValue(true)
    .allowedAggFuncs(AggregationFunction.avg, AggregationFunction.count)
    .build();
```


**⚠️ Disclaimer**
Currently aggregation functions `first` and `last` are not supported in JPA. Using these functions will result in runtime exception.
Supported functions are: `avg`, `sum`, `min`, `max`, `count`.

## Aggregation - Filtering
Filtering can be configured to impact aggregate values in the grid.

### Ignore Filters when Aggregating
When using Filters and Aggregations together, the aggregated values reflect only the rows which have passed the filter. 
This can be changed to instead ignore applied filters by using the `suppressAggFilteredOnly` grid option.

```java
QueryBuilder<Entity> queryBuilder = QueryBuilder.builder(Entity.class, entityManager)
    .colDefs(
        // ...col defs
    )
    .suppressAggFilteredOnly(true)
    .build();
```

### Filtering for Aggregated Values
The grid only applies filters to leaf level rows, this can be toggled to instead also apply filtering to group rows by enabling the `groupAggFiltering` grid option, 
allowing filters to also apply against the aggregated values.

```java
QueryBuilder<Entity> queryBuilder = QueryBuilder.builder(Entity.class, entityManager)
    .colDefs(
        // ...col defs
    )
    .groupAggFiltering(true)
    .build();
```

- When a group row passes a filter, it also includes all of its descendent rows in the filtered results.
- The `suppressAggFilteredOnly` grid option will be implicitly enabled.

