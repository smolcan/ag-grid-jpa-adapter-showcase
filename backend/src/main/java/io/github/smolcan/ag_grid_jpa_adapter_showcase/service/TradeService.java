package io.github.smolcan.ag_grid_jpa_adapter_showcase.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.dto.CustomNumberFilter;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.model.entity.Trade;
import io.github.smolcan.aggrid.jpa.adapter.exceptions.OnPivotMaxColumnsExceededException;
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
                .addCustomColumnFilterRecognizer((map) -> {
                    if (map.containsKey("filterType") && "customNumber".equalsIgnoreCase(map.get("filterType").toString())) {
                        CustomNumberFilter customNumberFilter = new CustomNumberFilter();
                        customNumberFilter.setValue(map.get("value").toString());
                        return customNumberFilter;
                    } else {
                        return null;
                    }
                })
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
