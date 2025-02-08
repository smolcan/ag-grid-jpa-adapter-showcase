package io.github.smolcan.ag_grid_jpa_adapter_showcase.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.dto.CustomNumberFilter;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.entity.Trade;
import io.github.smolcan.aggrid.jpa.adapter.column.ColDef;
import io.github.smolcan.aggrid.jpa.adapter.exceptions.OnPivotMaxColumnsExceededException;
import io.github.smolcan.aggrid.jpa.adapter.filter.model.simple.params.MultiFilterParams;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.AgMultiColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.AgSetColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgDateColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgNumberColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.filter.provided.simple.AgTextColumnFilter;
import io.github.smolcan.aggrid.jpa.adapter.query.QueryBuilder;
import io.github.smolcan.aggrid.jpa.adapter.request.ServerSideGetRowsRequest;
import io.github.smolcan.aggrid.jpa.adapter.response.LoadSuccessParams;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;


@Service
public class TradeService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Logger LOGGER = Logger.getLogger(TradeService.class.getName());
    
    private final EntityManager entityManager;
    private final QueryBuilder<Trade> queryBuilder;
    
    @Autowired
    public TradeService(EntityManager entityManager) {
        this.entityManager = entityManager;
        this.queryBuilder = QueryBuilder.builder(Trade.class, entityManager)
                .colDefs(
                        // trade id
                        ColDef.builder()
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
                                .build(),
                        
                        // product
                        ColDef.builder()
                                .field("product")
                                .filter(new AgMultiColumnFilter()
                                        .filterParams(
                                                MultiFilterParams.builder()
                                                        .filters(
                                                                new AgTextColumnFilter(),
                                                                new AgSetColumnFilter()
                                                        )
                                                        .build()
                                        )
                                )
                                .build(),
                        
                        // birthDate
                        ColDef.builder()
                                .field("birthDate")
                                .filter(new AgMultiColumnFilter()
                                        .filterParams(
                                                MultiFilterParams.builder()
                                                        .filters(
                                                                new AgDateColumnFilter(),
                                                                new AgSetColumnFilter()
                                                        )
                                                        .build()
                                        )
                                )
                                .build(),
                        
                        // isSold
                        ColDef.builder()
                                .field("isSold")
                                .filter(new AgSetColumnFilter())
                                .build(),

                        // Portfolio with text filter
                        ColDef.builder()
                                .field("portfolio")
                                .filter(new AgTextColumnFilter())
                                .build(),

                        // Book with text filter
                        ColDef.builder()
                                .field("book")
                                .filter(new AgTextColumnFilter())
                                .build(),

                        // Submitter ID with multi-column filter
                        ColDef.builder()
                                .field("submitterId")
                                .filter(new AgMultiColumnFilter()
                                        .filterParams(
                                                MultiFilterParams.builder()
                                                        .filters(
                                                                new AgNumberColumnFilter(),
                                                                new AgSetColumnFilter()
                                                        )
                                                        .build()
                                        )
                                )
                                .build(),

                        // Submitter Deal ID with number filter
                        ColDef.builder()
                                .field("submitterDealId")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // Deal Type with text filter
                        ColDef.builder()
                                .field("dealType")
                                .filter(new AgTextColumnFilter())
                                .build(),

                        // Bid Type with text filter
                        ColDef.builder()
                                .field("bidType")
                                .filter(new AgTextColumnFilter())
                                .build(),

                        // Current Value with number filter
                        ColDef.builder()
                                .field("currentValue")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // Previous Value with number filter
                        ColDef.builder()
                                .field("previousValue")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // PL1 with number filter
                        ColDef.builder()
                                .field("pl1")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // PL2 with number filter
                        ColDef.builder()
                                .field("pl2")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // Gain Dx with number filter
                        ColDef.builder()
                                .field("gainDx")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // SX Px with number filter
                        ColDef.builder()
                                .field("sxPx")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // X99 Out with number filter
                        ColDef.builder()
                                .field("x99Out")
                                .filter(new AgNumberColumnFilter())
                                .build(),

                        // Batch with number filter
                        ColDef.builder()
                                .field("batch")
                                .filter(new AgNumberColumnFilter())
                                .build()

                        )
                .build();
    }
    
    public LoadSuccessParams getRows(ServerSideGetRowsRequest request) 
            throws JsonProcessingException, OnPivotMaxColumnsExceededException {
        LOGGER.info("getRows called, received request: ");
        LOGGER.info(OBJECT_MAPPER.writeValueAsString(request));
        LOGGER.info("executing...: ");
        return this.queryBuilder.getRows(request);
    }
}
