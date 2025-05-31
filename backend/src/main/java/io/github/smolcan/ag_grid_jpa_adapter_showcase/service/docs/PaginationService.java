package io.github.smolcan.ag_grid_jpa_adapter_showcase.service.docs;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.entity.Trade;
import io.github.smolcan.aggrid.jpa.adapter.column.ColDef;
import io.github.smolcan.aggrid.jpa.adapter.exceptions.OnPivotMaxColumnsExceededException;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgDateColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgNumberColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgTextColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.query.QueryBuilder;
import io.github.smolcan.aggrid.jpa.adapter.request.ServerSideGetRowsRequest;
import io.github.smolcan.aggrid.jpa.adapter.response.LoadSuccessParams;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class PaginationService {

    private final QueryBuilder<Trade> queryBuilder;
    private final QueryBuilder<Trade> paginateChildRowsQueryBuilder;
    
    @Autowired
    public PaginationService(EntityManager entityManager) {
        this.queryBuilder = QueryBuilder.builder(Trade.class, entityManager)
                .colDefs(
                        ColDef.builder()
                                .field("tradeId")
                                .filter(
                                        new AgNumberColumnFilter()
                                )
                                .build(),

                        ColDef.builder()
                                .field("submitterId")
                                .filter(
                                        new AgNumberColumnFilter()
                                )
                                .build(),

                        ColDef.builder()
                                .field("portfolio")
                                .enableRowGroup(true)
                                .filter(new AgTextColumnFilter())
                                .build(),

                        ColDef.builder()
                                .field("birthDate")
                                .filter(
                                        new AgDateColumnFilter()
                                )
                                .build()
                )
                .build();

        this.paginateChildRowsQueryBuilder = QueryBuilder.builder(Trade.class, entityManager)
                .colDefs(
                        ColDef.builder()
                                .field("tradeId")
                                .filter(
                                        new AgNumberColumnFilter()
                                )
                                .build(),

                        ColDef.builder()
                                .field("submitterId")
                                .filter(
                                        new AgNumberColumnFilter()
                                )
                                .build(),

                        ColDef.builder()
                                .field("portfolio")
                                .enableRowGroup(true)
                                .filter(new AgTextColumnFilter())
                                .build(),

                        ColDef.builder()
                                .field("birthDate")
                                .filter(
                                        new AgDateColumnFilter()
                                )
                                .build()
                )
                .paginateChildRows(true)
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

    @Transactional(readOnly = true)
    public long countRows(ServerSideGetRowsRequest request) {
        try {
            return this.queryBuilder.countRows(request);
        } catch (OnPivotMaxColumnsExceededException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional(readOnly = true)
    public LoadSuccessParams paginateChildRowsGetRows(ServerSideGetRowsRequest request) {
        try {
            return this.paginateChildRowsQueryBuilder.getRows(request);
        } catch (OnPivotMaxColumnsExceededException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional(readOnly = true)
    public long paginateChildRowsCountRows(ServerSideGetRowsRequest request) {
        try {
            return this.paginateChildRowsQueryBuilder.countRows(request);
        } catch (OnPivotMaxColumnsExceededException e) {
            throw new RuntimeException(e);
        }
    }
}
