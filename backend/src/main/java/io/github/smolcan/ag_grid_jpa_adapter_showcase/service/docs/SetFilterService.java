package io.github.smolcan.ag_grid_jpa_adapter_showcase.service.docs;

import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.entity.Trade;
import io.github.smolcan.aggrid.jpa.adapter.column.ColDef;
import io.github.smolcan.aggrid.jpa.adapter.exceptions.OnPivotMaxColumnsExceededException;
import io.github.smolcan.aggrid.jpa.adapter.filter.model.simple.params.SetFilterParams;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.AgSetColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.query.QueryBuilder;
import io.github.smolcan.aggrid.jpa.adapter.request.ServerSideGetRowsRequest;
import io.github.smolcan.aggrid.jpa.adapter.response.LoadSuccessParams;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.Expression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class SetFilterService {
    private final QueryBuilder<Trade> queryBuilder;

    @Autowired
    public SetFilterService(EntityManager entityManager) {
        this.queryBuilder = QueryBuilder.builder(Trade.class, entityManager)
                .colDefs(
                        ColDef.builder()
                                .field("tradeId")
                                .filter(false)
                                .build(),

                        ColDef.builder()
                                .field("product")
                                .filter(new AgSetColumnFilter())
                                .build(),

                        ColDef.builder()
                                .field("portfolio")
                                .filter(
                                        new AgSetColumnFilter()
                                                .filterParams(
                                                        SetFilterParams
                                                                .builder()
                                                                .caseSensitive(true)
                                                                .build()
                                                )
                                )
                                .build(),

                        ColDef.builder()
                                .field("book")
                                .filter(
                                        new AgSetColumnFilter()
                                                .filterParams(
                                                        SetFilterParams
                                                                .builder()
                                                                .textFormatter((cb, expr) -> {
                                                                    Expression<String> newExpression = expr;
                                                                    // lower input
                                                                    newExpression = cb.lower(newExpression);
                                                                    // Remove accents
                                                                    newExpression = cb.function("TRANSLATE", String.class, newExpression,
                                                                            cb.literal("áéíóúÁÉÍÓÚüÜñÑýÝ"),
                                                                            cb.literal("aeiouAEIOUuUnNyY"));

                                                                    return newExpression;
                                                                })
                                                                .build()
                                                )
                                )
                                .build(),

                        ColDef.builder()
                                .field("submitterId")
                                .filter(new AgSetColumnFilter())
                                .build(),


                        ColDef.builder()
                                .field("birthDate")
                                .filter(new AgSetColumnFilter())
                                .build(),

                        ColDef.builder()
                                .field("isSold")
                                .filter(new AgSetColumnFilter())
                                .build()
                )
                .build();
    }

    
    @Transactional(readOnly = true)
    public LoadSuccessParams getRows(ServerSideGetRowsRequest request) {
        try {
            return this.queryBuilder.getRows(request);
        } catch (OnPivotMaxColumnsExceededException e) {
            throw new RuntimeException(e);
        }
    }
}
