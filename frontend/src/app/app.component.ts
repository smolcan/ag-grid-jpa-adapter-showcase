import {AgGridAngular} from 'ag-grid-angular';
import {Component} from '@angular/core';
import {ColDef} from 'ag-grid-community'; // Column Definition Type Interface
import {
  AllEnterpriseModule, GridApi, GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams, ITextFilterParams,
  LoadSuccessParams, ModuleRegistry
} from 'ag-grid-enterprise';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CustomNumberFilterComponent} from './custom-number-filter/custom-number-filter.component';
import {themeAlpine} from 'ag-grid-community';
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

  theme = themeAlpine.withParams({
    /* Changes the color of the grid text */
    foregroundColor: 'rgb(220, 220, 220)', /* Light gray text for readability */

    /* Changes the color of the grid background */
    backgroundColor: 'rgb(30, 30, 30)', /* Very dark gray background for the grid */

    /* Changes the header color of the top row */
    headerBackgroundColor: 'rgb(50, 50, 50)', /* Darker gray for the header */

    /* Changes the hover color of the row */
    rowHoverColor: 'rgb(70, 70, 70)', /* Medium dark gray to highlight hovered rows */

    /* Optional: Borders and grid lines */
    borderColor: 'rgb(60, 60, 60)', /* Slightly lighter border lines */

    /* Optional: Focused cell or active row */
    selectedRowBackgroundColor: 'rgb(80, 80, 80)', /* Subtle lighter gray for selected rows */

    /* Optional: Alternate row background for zebra striping */
    oddRowBackgroundColor: 'rgb(35, 35, 35)', /* Dark gray for odd rows */
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
    {
      field: 'tradeId',
      headerName: 'Trade ID',
      sortable: true,
      cellDataType: 'number',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              values: [1013559, 1013560, 1013560.2324]
            }
          },
          {
            filter: CustomNumberFilterComponent,
          }
        ]
      }
    },
    {
      field: 'product',
      headerName: 'Product',
      sortable: true,
      cellDataType: 'text',
      filter: 'agMultiColumnFilter',
      filterParams: {
        values: ['ProductA', 'ProductB', 'ProductC']
      }
    },
    {
      field: 'portfolio',
      headerName: 'Portfolio',
      sortable: true,
      cellDataType: 'text',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['Portfolio1', 'Portfolio2', 'Portfolio3']
            }
          },
          {
            filter: 'agTextColumnFilter',
            filterParams: {
              defaultOption: "startsWith",
            } as ITextFilterParams,
          },
        ]
      }
    },
    {
      field: 'book',
      headerName: 'Book',
      sortable: true,
      cellDataType: 'text',
      filter: true
    },
    {
      field: 'submitterId',
      headerName: 'Submitter ID',
      cellDataType: 'number',
      sortable: true,
      filter: true
    },
    {
      field: 'submitterDealId',
      headerName: 'Submitter Deal ID',
      cellDataType: 'number',
      sortable: true,
      filter: true
    },
    {
      field: 'dealType',
      headerName: 'Deal Type',
      sortable: true,
      cellDataType: 'text',
      filter: 'agTextColumnFilter'
    },
    {field: 'bidType', headerName: 'Bid Type', sortable: true, cellDataType: 'text', filter: 'agTextColumnFilter'},
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
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      sortable: true,
      cellDataType: 'dateString',
      filter: 'agSetColumnFilter',
      filterParams: {values: ['1993-06-24', '1973-09-23']}
    },
    {field: 'isSold', headerName: 'Is Sold', cellDataType: 'boolean', filterParams: {values: [true, false]}},
  ];

  tryPivoting() {
    if (!this.gridApi) {
      return;
    }

    this.pivotMode = true;
    // Update existing colDefs dynamically for pivoting
    this.colDefs = this.colDefs.map((colDef) => {
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
}
