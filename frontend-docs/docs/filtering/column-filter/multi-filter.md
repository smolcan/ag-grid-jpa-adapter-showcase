---
sidebar_position: 5
---

# Multi Filter
The Multi Filter allows multiple [Column filters](column-filter.md) (Provided Filters or [Custom Filters](custom-filter.md)) to be used on the same column. This provides greater flexibility when filtering data in the grid.

## Using Multi Filter
Multi filter is represented by class [AgMultiColumnFilter](https://github.com/smolcan/ag-grid-jpa-adapter/blob/main/src/main/java/io/github/smolcan/aggrid/jpa/adapter/filter/provided/AgMultiColumnFilter.java).

```java
ColDef colDef = ColDef.builder()
    .field("tradeId")
    .filter(new AgMultiColumnFilter()
        .filterParams(
            MultiFilterParams.builder()
                .filters(
                    new AgNumberColumnFilter(),
                    new CustomNumberFilter()
                )
                .build()
        )
    )
    .build()
```

## Multi Filter Parameters
Multi Filters are configured though the filter params ([MultiFilterParams](https://github.com/smolcan/ag-grid-jpa-adapter/blob/main/src/main/java/io/github/smolcan/aggrid/jpa/adapter/filter/model/simple/params/MultiFilterParams.java) class)

| Property            | Type                                                                  | Default | Description     |
|---------------------|-----------------------------------------------------------------------|---------|-----------------|
| **`filters`**       | `List<IFilter<?, ?>>`                                                             | -       | List of filters |

Example of using filter parameters (also with child filters parameters).
```java
ColDef colDef = ColDef.builder()
    .field("tradeId")
    .filter(new AgMultiColumnFilter()
        .filterParams(
            MultiFilterParams.builder()
                .filters(
                    new AgNumberColumnFilter()
                        .filterParams(
                            NumberFilterParams.builder()
                                .inRangeInclusive(true)
                                .includeBlanksInEquals(true)
                                .build()
                        ),
                    new CustomNumberFilter()
                        .filterParams(
                            new CustomNumberFilterParams(false)
                        )
                )
                .build()
        )
    )
    .build()
```

## Multi Filter Model
Multi filter model is represented by [MultiFilterModel](https://github.com/smolcan/ag-grid-jpa-adapter/blob/main/src/main/java/io/github/smolcan/aggrid/jpa/adapter/filter/model/simple/MultiFilterModel.java) class.

## Grid using Server Side Multi Filter

import MultiFilterGrid from './multi-filter-grid';

<MultiFilterGrid></MultiFilterGrid>
