import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Output() selectedValueEmitter: EventEmitter<number> =
    new EventEmitter<number>();

  changeValue(event: any) {
    this.selectedValueEmitter.emit(+event.target.value);
  }
}
