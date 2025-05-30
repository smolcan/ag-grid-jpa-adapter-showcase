import {ModuleRegistry} from 'ag-grid-community';
import {
    ColDef, ColumnAutoSizeModule, GridReadyEvent,
    IServerSideDatasource, NumberFilterModule, NumberFilterParams,
    ServerSideRowModelModule,
    themeQuartz, ValidationModule
} from 'ag-grid-enterprise';
import React, {useMemo, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import {AgGridReact} from 'ag-grid-react';


ModuleRegistry.registerModules([ServerSideRowModelModule, NumberFilterModule, ValidationModule, ColumnAutoSizeModule]);
const NumberFilterGrid = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { colorMode } = useColorMode();

    const theme = useMemo(() =>
        themeQuartz.withParams({
            backgroundColor: colorMode === 'dark' ? "#1f2836" : "#ffffff",
            browserColorScheme: colorMode,
            chromeBackgroundColor: {
                ref: "foregroundColor",
                mix: 0.07,
                onto: "backgroundColor"
            },
            foregroundColor: colorMode === 'dark' ? "#FFF" : "#000",
            headerFontSize: 14
        }), [colorMode]);

    const columnDefs = useMemo(() => [
        {
            headerName: 'Trade Id',
            field: 'tradeId',
            cellDataType: 'number',
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Submitter ID',
            field: 'submitterId',
            cellDataType: 'number',
            filter: 'agNumberColumnFilter',
            filterParams: {
                inRangeInclusive: true,
            } as NumberFilterParams,
        },
        {
            headerName: 'Submitter Deal ID',
            field: 'submitterDealId',
            cellDataType: 'number',
            filter: 'agNumberColumnFilter',
            filterParams: {
                includeBlanksInEquals: true,
                includeBlanksInNotEqual: true,
            } as NumberFilterParams,
        },
        {
            headerName: 'Current Value',
            field: 'currentValue',
            cellDataType: 'number',
            filter: 'agNumberColumnFilter',
            filterParams: {
                includeBlanksInLessThan: true,
                includeBlanksInGreaterThan: true,
            } as NumberFilterParams,
        },
        {
            headerName: 'Previous Value',
            field: 'previousValue',
            cellDataType: 'number',
            filter: 'agNumberColumnFilter',
            filterParams: {
                includeBlanksInRange: true,
            } as NumberFilterParams,
        },
    ] as ColDef[], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        filter: true,
        flex: 1,
    } as ColDef), []);

    const serverSideDatasource: IServerSideDatasource = useMemo(() => ({
        getRows: (params) => {
            fetch('http://localhost:8080/docs/filtering/column-filter/number-filter/getRows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params.request)
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorText = await response.text(); // Read plain text from Spring Boot
                        throw new Error(errorText || `HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setErrorMessage(null);
                    params.success(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setErrorMessage(error.message || 'Failed to fetch data');
                    params.fail();
                });
        }
    }), []);

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
    };

    return (
        <div style={{
            backgroundColor: colorMode == 'dark' ? '#1a1c1d' : '#ffffff',
            marginBottom: '1rem',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '1rem'
        }}>
            {errorMessage && (
                <div style={{
                    backgroundColor: '#ff4d4f',
                    color: '#fff',
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    fontWeight: 500
                }}>
                    {errorMessage}
                </div>
            )}
            <div style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    serverSideDatasource={serverSideDatasource}
                    onGridReady={onGridReady}
                    rowModelType="serverSide"
                    theme={theme}
                    animateRows={true}
                    suppressMenuHide={true}
                />
            </div>
        </div>
    );
};

export default NumberFilterGrid;