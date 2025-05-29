package io.github.smolcan.ag_grid_jpa_adapter_showcase.controller.docs;

import io.github.smolcan.ag_grid_jpa_adapter_showcase.service.docs.SortingService;
import io.github.smolcan.aggrid.jpa.adapter.request.ServerSideGetRowsRequest;
import io.github.smolcan.aggrid.jpa.adapter.response.LoadSuccessParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/docs/sorting")
@RequiredArgsConstructor
public class SortingController {
    
    private final SortingService sortingService;

    @PostMapping("getRows")
    public ResponseEntity<LoadSuccessParams> getRows(@RequestBody ServerSideGetRowsRequest request) {
        LoadSuccessParams result = this.sortingService.getRows(request);
        return ResponseEntity.ok(result);
    }
    
    
}
