import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

/** Polymorphic button with visual variants and loading state. */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="baseClasses() + ' ' + variantClasses()"
      (click)="clicked.emit($event)"
    >
      @if (loading()) {
        <svg class="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  clicked = output<MouseEvent>();

  baseClasses(): string {
    return 'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  }

  variantClasses(): string {
    const map: Record<string, string> = {
      primary:
        'bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus:ring-primary-500',
      secondary:
        'border border-border bg-surface-raised text-gray-700 shadow-sm hover:bg-surface-overlay focus:ring-primary-500',
      danger:
        'bg-danger-500 text-white shadow-sm hover:bg-danger-700 focus:ring-danger-500',
      ghost:
        'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary-500',
    };
    return map[this.variant()] ?? map['primary'];
  }
}
