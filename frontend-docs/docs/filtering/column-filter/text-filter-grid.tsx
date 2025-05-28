import React, {useMemo, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import {
    ColDef,
    GridReadyEvent,
    IServerSideDatasource,
    ServerSideRowModelModule,
    TextFilterModule, TextFilterParams,
    themeQuartz
} from 'ag-grid-enterprise';
import {AgGridReact} from 'ag-grid-react';
import {ModuleRegistry} from 'ag-grid-community';

ModuleRegistry.registerModules([ServerSideRowModelModule, TextFilterModule]);

const TextFilterGrid = () => {
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
            filter: false,
        },
        {
            headerName: 'Portfolio',
            field: 'portfolio',
            cellDataType: 'text',
            filter: 'agTextColumnFilter',
        },
        {
            headerName: 'Product',
            field: 'product',
            cellDataType: 'text',
            filter: 'agTextColumnFilter',
            filterType: {
                caseSensitive: false,
            } as TextFilterParams,
        },
        {
            headerName: 'Book',
            field: 'book',
            cellDataType: 'text',
            filter: 'agTextColumnFilter',
            filterType: {
            } as TextFilterParams,
        },
        {
            headerName: 'Deal Type',
            field: 'dealType',
            cellDataType: 'text'
        },
        {
            headerName: 'Bid Type',
            field: 'bidType',
            cellDataType: 'text'
        },
    ] as ColDef[], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        filter: true,
        flex: 1,
    } as ColDef), []);

    const serverSideDatasource: IServerSideDatasource = useMemo(() => ({
        getRows: (params) => {
            fetch('http://localhost:8080/docs/filtering/column-filter/text-filter/getRows', {
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
            backgroundColor: colorMode == 'dark' ? '#1f2836' : '#ffffff',
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

export default TextFilterGrid;