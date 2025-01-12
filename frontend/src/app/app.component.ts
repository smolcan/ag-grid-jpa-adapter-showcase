import {AgGridAngular} from 'ag-grid-angular';
import {Component} from '@angular/core';
import {ColDef} from 'ag-grid-community'; // Column Definition Type Interface
import {
  AllEnterpriseModule, GridApi, GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  LoadSuccessParams, ModuleRegistry
} from 'ag-grid-enterprise';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CustomNumberFilterComponent} from './custom-number-filter/custom-number-filter.component';
import {themeQuartz} from 'ag-grid-community';
import {Trade} from './trade';

@Component({
  selector: 'app-root',
  imports: [
    AgGridAngular,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private gridApi: GridApi<Trade> | null = null;
  pivotMode: boolean = false;

  theme = themeQuartz
    .withParams({
      backgroundColor: "#1f2836",
      browserColorScheme: "dark",
      chromeBackgroundColor: {
        ref: "foregroundColor",
        mix: 0.07,
        onto: "backgroundColor"
      },
      foregroundColor: "#FFF",
      headerFontSize: 14
    });

  enableAdvancedFilter = false;

  gridReady(event: GridReadyEvent<Trade>) {
    this.gridApi = event.api;
  }

  toggleAdvancedFilter() {
    this.enableAdvancedFilter = !this.enableAdvancedFilter;
  }

  showSidebar = true;

  toggleShowSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  constructor(
    private http: HttpClient
  ) {
    ModuleRegistry.registerModules([AllEnterpriseModule])
  }


  serverSideDatasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      this.http.post<LoadSuccessParams>('http://localhost:8080/getRows', params.request).subscribe((res) => {
        params.success(res);
      }, () => {
        params.fail();
      })
    }
  }

  defaultColDef: ColDef = {
    filter: true,
    enableRowGroup: true,
    enableValue: true,
    enablePivot: true,
  };

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    // multi column filter demonstration with custom filter
    {
      field: 'tradeId',
      headerName: 'Trade ID',
      sortable: true,
      cellDataType: 'number',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agNumberColumnFilter',
          },
          {
            filter: CustomNumberFilterComponent,
          }
        ],
      }
    },
    {
      field: 'product',
      headerName: 'Product',
      sortable: true,
      cellDataType: 'text',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agTextColumnFilter',
          },
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
            }
          }
        ],
      },
    },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      sortable: true,
      cellDataType: 'dateString',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agDateColumnFilter',
          },
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['2025-01-09', '1973-09-23'],
            }
          }
        ],
      },
    },
    {
      field: 'isSold',
      headerName: 'Is Sold',
      cellDataType: 'boolean',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [true, false],
      }
    },
    {
      field: 'portfolio',
      headerName: 'Portfolio',
      sortable: true,
      cellDataType: 'text',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'book',
      headerName: 'Book',
      sortable: true,
      cellDataType: 'text',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'submitterId',
      headerName: 'Submitter ID',
      cellDataType: 'number',
      sortable: true,
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agNumberColumnFilter',
          },
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['10', '20', '30', '40'],
            }
          }
        ],
      },
    },
    {
      field: 'submitterDealId',
      headerName: 'Submitter Deal ID',
      cellDataType: 'number',
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'dealType',
      headerName: 'Deal Type',
      sortable: true,
      cellDataType: 'text',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'bidType',
      headerName: 'Bid Type',
      sortable: true,
      cellDataType: 'text',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'currentValue',
      headerName: 'Current Value',
      sortable: true,
      cellDataType: 'number',
      filter: 'agNumberColumnFilter'
    },
    {
      field: 'previousValue',
      headerName: 'Previous Value',
      sortable: true,
      cellDataType: 'number',
      filter: 'agNumberColumnFilter'
    },
    {field: 'pl1', headerName: 'PL1', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'pl2', headerName: 'PL2', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'gainDx', headerName: 'Gain Dx', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'sxPx', headerName: 'SX Px', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'x99Out', headerName: 'X99 Out', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'batch', headerName: 'Batch', sortable: true, cellDataType: 'number', filter: 'agNumberColumnFilter'},
    {field: 'isSold', headerName: 'Is Sold', cellDataType: 'boolean', filterParams: {values: [true, false]}},
  ];

  pivotingColDefs = this.colDefs.map((colDef) => {
    if (colDef.field === 'product' || colDef.field === 'portfolio') {
      return { ...colDef, rowGroup: true }; // Set as row group
    }
    if (colDef.field === 'book' || colDef.field === 'dealType' || colDef.field === 'bidType') {
      return { ...colDef, pivot: true }; // Set as pivot
    }
    if (colDef.field === 'currentValue') {
      return { ...colDef, aggFunc: 'sum' }; // Set aggregation function
    }
    if (colDef.field === 'submitterId') {
      return { ...colDef, aggFunc: 'count' }; // Count aggregation
    }
    if (colDef.field === 'birthDate') {
      return { ...colDef, aggFunc: 'min' }; // Minimum aggregation
    }
    return colDef; // Leave other columns unchanged
  });

  togglePivoting() {
    this.pivotMode = !this.pivotMode;
  }
}
