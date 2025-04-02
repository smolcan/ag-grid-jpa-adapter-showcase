package io.github.smolcan.ag_grid_jpa_adapter_showcase.model.dto;

import io.github.smolcan.aggrid.jpa.adapter.filter.model.simple.params.IFilterParams;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomNumberFilterParams implements IFilterParams {
    private boolean includeNullValues;
}
