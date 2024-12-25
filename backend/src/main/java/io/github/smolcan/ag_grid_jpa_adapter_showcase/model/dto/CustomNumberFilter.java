package io.github.smolcan.ag_grid_jpa_adapter_showcase.model.dto;

import io.github.smolcan.aggrid.jpa.adapter.filter.simple.ColumnFilter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class CustomNumberFilter extends ColumnFilter {
    
    private String value;
    
    public CustomNumberFilter() {
        super("customNumber");
    }
    
    @Override
    public Predicate toPredicate(CriteriaBuilder cb, Root<?> root, String columnName) {
        if (this.value == null || this.value.equalsIgnoreCase("All")) {
            return cb.and();
        }

        Path<Integer> field = root.get(columnName);
        if (this.value.equalsIgnoreCase("Even")) {
            return cb.equal(cb.mod(field, 2), 0);
        } else {
            return cb.notEqual(cb.mod(field, 2), 0);
        }
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}