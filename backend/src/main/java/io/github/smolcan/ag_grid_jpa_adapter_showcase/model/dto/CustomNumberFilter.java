package io.github.smolcan.ag_grid_jpa_adapter_showcase.model.dto;

import io.github.smolcan.aggrid.jpa.adapter.filter.IFilter;
import jakarta.persistence.criteria.*;

import java.util.Map;

public class CustomNumberFilter extends IFilter<CustomNumberFilterModel, CustomNumberFilterParams> {
    
    @Override
    public CustomNumberFilterModel recognizeFilterModel(Map<String, Object> map) {
        CustomNumberFilterModel customNumberFilter = new CustomNumberFilterModel();
        customNumberFilter.setValue(map.get("value").toString());
        return customNumberFilter;
    }

    @Override
    public CustomNumberFilterParams getDefaultFilterParams() {
        return null;
    }

    @Override
    public Predicate toPredicate(CriteriaBuilder cb, Expression<?> expression, CustomNumberFilterModel customNumberFilterModel) {
        String value = customNumberFilterModel.getValue();
        if (value == null || value.equalsIgnoreCase("All")) {
            return cb.and();
        }

        Expression<Integer> integerExpression = expression.as(Integer.class);
        if (value.equalsIgnoreCase("Even")) {
            return cb.equal(cb.mod(integerExpression, 2), 0);
        } else {
            return cb.notEqual(cb.mod(integerExpression, 2), 0);
        }
    }

}
