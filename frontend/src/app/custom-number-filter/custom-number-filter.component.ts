import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IFilterAngularComp} from 'ag-grid-angular';
import {AgPromise, IDoesFilterPassParams, IFilterParams} from 'ag-grid-enterprise';


@Component({
  selector: 'app-custom-number-filter',
  imports: [FormsModule],
  templateUrl: './custom-number-filter.component.html',
  styleUrl: './custom-number-filter.component.css'
})
export class CustomNumberFilterComponent implements IFilterAngularComp {
  params!: IFilterParams;
  value = 'All';

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.value === 'All') {
      return true;
    }

    const tradeId = params.data.tradeId;
    if (tradeId === null) {
      return false;
    }

    const mod = Number(tradeId) % 2;
    if (this.value === 'Even') {
      return mod === 0;
    } else {
      return mod === 1;
    }
  }

  getModel(): any {
    return {
      filterType: "customNumber",
      value: this.value,
    }
  }

  isFilterActive(): boolean {
    return this.value === 'Even' || this.value === 'Odd';
  }

  setModel(model: any): void | AgPromise<void> {
    this.value = model?.value;
  }

  updateFilter(): void {
    this.params.filterChangedCallback();
  }

}
