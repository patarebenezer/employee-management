import { Component, EventEmitter, HostListener, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @Input() options: string[] = [];
  @Input() placeholder = 'Select an option';
  @Output() blurred = new EventEmitter<void>();

  isOpen = false;
  filterText = '';
  selectedValue: string | null = null;
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  get filteredOptions(): string[] {
    const q = this.filterText.trim().toLowerCase();
    if (!q) return this.options;
    return this.options.filter((o) => o.toLowerCase().includes(q));
  }

  toggleOpen(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterText = '';
    }
  }

  selectOption(option: string): void {
    this.selectedValue = option;
    this.onChange(option);
    this.onTouched();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (this.isOpen && !target.closest('app-searchable-select')) {
      this.isOpen = false;
      this.onTouched();
      this.blurred.emit();
    }
  }

  writeValue(value: string | null): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
