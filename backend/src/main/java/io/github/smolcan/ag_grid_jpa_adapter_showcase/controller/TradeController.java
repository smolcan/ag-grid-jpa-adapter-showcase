package io.github.smolcan.ag_grid_jpa_adapter_showcase.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.github.smolcan.ag_grid_jpa_adapter_showcase.service.TradeService;
import io.github.smolcan.aggrid.jpa.adapter.exceptions.OnPivotMaxColumnsExceededException;
import io.github.smolcan.aggrid.jpa.adapter.request.ServerSideGetRowsRequest;
import io.github.smolcan.aggrid.jpa.adapter.response.LoadSuccessParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class TradeController {
    
    private final TradeService tradeService;
    
    @PostMapping("/getRows")
    public ResponseEntity<LoadSuccessParams> getRows(@RequestBody ServerSideGetRowsRequest request)
            throws JsonProcessingException, OnPivotMaxColumnsExceededException {
        LoadSuccessParams result = this.tradeService.getRows(request);
        return ResponseEntity.ok(result);
    }
    
}
