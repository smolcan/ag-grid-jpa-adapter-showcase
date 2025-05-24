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
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    AgGridAngular,
    HttpClientModule,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isServerSide: boolean = true; // Controls which grid is displayed
  rowData: Trade[] | null = null; // To store client-side data
  pivotMode: boolean = false;
  enableAdvancedFilter = false;
  showSidebar = true;
  pagination = true;
  paginateChildRows = true;
  refetchRowCount: boolean = true;


  private serverSideGridApi: GridApi<Trade> | null = null;
  private clientSideGridApi: GridApi<Trade> | null = null;

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

  constructor(
    private http: HttpClient
  ) {
    ModuleRegistry.registerModules([AllEnterpriseModule])
  }

  // Toggle between server-side and client-side grids
  toggleDataMode() {
    this.isServerSide = !this.isServerSide;

    // If switching to client-side and we don't have data yet, fetch it
    if (!this.isServerSide && !this.rowData) {
      this.loadClientSideData();
    }
  }

  // Load client-side data
  loadClientSideData() {
    this.http.get<Trade[]>('http://localhost:8080/getClientSideRows').subscribe(
      (data) => {
        this.rowData = data;
      },
      (error) => {
        console.error('Error loading client-side data:', error);
      }
    );
  }

  // Grid ready events for both grids
  onServerSideGridReady(event: GridReadyEvent<Trade>) {
    this.serverSideGridApi = event.api;

    event.api.addEventListener('filterChanged', () => this.refetchRowCount = true);
    event.api.addEventListener('columnRowGroupChanged', () => this.refetchRowCount = true);
    event.api.addEventListener('columnPivotChanged', () => this.refetchRowCount = true);
    event.api.addEventListener('columnValueChanged', () => this.refetchRowCount = true);
    // if opened row group and paginate child rows is turned on, need to refetch row count
    event.api.addEventListener('rowGroupOpened', () => this.refetchRowCount = this.paginateChildRows);
  }

  onClientSideGridReady(event: GridReadyEvent<Trade>) {
    this.clientSideGridApi = event.api;

    // If we don't have client-side data yet, fetch it
    if (!this.rowData) {
      this.loadClientSideData();
    }
  }

  toggleAdvancedFilter() {
    this.enableAdvancedFilter = !this.enableAdvancedFilter;
  }

  toggleShowSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  togglePivoting() {
    this.pivotMode = !this.pivotMode;
  }

  togglePagination() {
    this.pagination = !this.pagination;
    if (this.pagination) {
      this.refetchRowCount = true;
    }

    // Optional: If you need to refresh the grid after toggling pagination
    if (this.serverSideGridApi) {
      this.serverSideGridApi.refreshServerSide({
        purge: true
      });
    }
  }

  serverSideDatasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      const dataRequest = this.http.post<LoadSuccessParams>('http://localhost:8080/getRows', params.request).toPromise();

      if (this.pagination && this.refetchRowCount) {
        const countRequest = this.http.post<number>('http://localhost:8080/countRows', params.request).toPromise();

        Promise.all([dataRequest, countRequest])
          .then(([data, rowCount]) => {
            params.success({
              ...data as LoadSuccessParams,
              rowCount: rowCount
            });
            this.refetchRowCount = false;
          })
          .catch(() => {
            params.fail();
          });

      } else {
        dataRequest
          .then((data) => {
            params.success(data as LoadSuccessParams);
          })
          .catch(() => {
            params.fail();
          });
      }
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
}
