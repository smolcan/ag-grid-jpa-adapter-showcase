import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule, CsvExportModule, themeQuartz } from 'ag-grid-community';

// Register the required modules
ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const Highlight = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState([]);

    // Custom theme matching your Angular implementation
    const theme = useMemo(() =>
            themeQuartz.withParams({
                backgroundColor: "#1f2836",
                browserColorScheme: "dark",
                chromeBackgroundColor: {
                    ref: "foregroundColor",
                    mix: 0.07,
                    onto: "backgroundColor"
                },
                foregroundColor: "#FFF",
                headerFontSize: 14
            })
        , []);

    // Sample data - replace with your own data
    const sampleData = [
        { id: 1, name: 'John Doe', age: 28, department: 'Engineering', salary: 75000, startDate: '2022-01-15' },
        { id: 2, name: 'Jane Smith', age: 32, department: 'Marketing', salary: 68000, startDate: '2021-03-20' },
        { id: 3, name: 'Bob Johnson', age: 45, department: 'Sales', salary: 82000, startDate: '2020-07-10' },
        { id: 4, name: 'Alice Brown', age: 29, department: 'Engineering', salary: 79000, startDate: '2022-05-12' },
        { id: 5, name: 'Charlie Wilson', age: 38, department: 'HR', salary: 65000, startDate: '2019-11-08' },
        { id: 6, name: 'Diana Davis', age: 26, department: 'Marketing', salary: 58000, startDate: '2023-02-14' },
        { id: 7, name: 'Frank Miller', age: 41, department: 'Sales', salary: 88000, startDate: '2018-09-25' },
        { id: 8, name: 'Grace Lee', age: 33, department: 'Engineering', salary: 92000, startDate: '2021-08-30' }
    ];

    // Column definitions
    const columnDefs = useMemo(() => [
        {
            headerName: 'ID',
            field: 'id',
            width: 80,
            sortable: true,
            filter: true,
            cellDataType: 'number'
        },
        {
            headerName: 'Name',
            field: 'name',
            width: 150,
            sortable: true,
            filter: true,
            cellDataType: 'text'
        },
        {
            headerName: 'Age',
            field: 'age',
            width: 80,
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellDataType: 'number'
        },
        {
            headerName: 'Department',
            field: 'department',
            width: 130,
            sortable: true,
            filter: true,
            cellDataType: 'text'
        },
        {
            headerName: 'Salary',
            field: 'salary',
            width: 120,
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellDataType: 'number',
            valueFormatter: params => '$' + params.value.toLocaleString()
        },
        {
            headerName: 'Start Date',
            field: 'startDate',
            width: 120,
            sortable: true,
            filter: 'agDateColumnFilter',
            cellDataType: 'dateString'
        }
    ], []);

    // Default column properties matching your Angular setup
    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        enableValue: true,
        enablePivot: true,
    }), []);

    useEffect(() => {
        setRowData(sampleData);
    }, []);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    };

    const onExportCsv = () => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        }
    };

    const onQuickFilterChanged = (event) => {
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#1f2836',
            color: '#ffffff',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>Employee Data Grid</h3>

            <div style={{
                marginBottom: '15px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={onQuickFilterChanged}
                    style={{
                        padding: '10px 12px',
                        border: '1px solid #404040',
                        borderRadius: '6px',
                        flex: 1,
                        maxWidth: '300px',
                        backgroundColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={onExportCsv}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#0d7377',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#14a085'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0d7377'}
                >
                    Export CSV
                </button>
            </div>

            <div style={{ height: '700px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    animateRows={true}
                    rowSelection="multiple"
                    theme={theme}
                    pagination={true}
                    paginationPageSize={20}
                    enableRangeSelection={true}
                    enableCharts={true}
                    suppressMenuHide={true}
                    rowGroupPanelShow="always"
                    pivotPanelShow="onlyWhenPivoting"
                    sideBar={true}
                />
            </div>
        </div>
    );
};

export default Highlight;