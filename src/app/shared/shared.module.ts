import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, SelectComponent, SpinnerComponent],
  imports: [CommonModule, RouterLink],
  exports: [HeaderComponent],
})
export class SharedModule {}
