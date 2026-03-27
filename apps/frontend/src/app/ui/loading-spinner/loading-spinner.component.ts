import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** SVG loading spinner with configurable size. */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center" [class]="containerClass()">
      <svg
        [class]="'animate-spin text-primary-500 ' + sizeClass()"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');

  sizeClass(): string {
    const map: Record<string, string> = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return map[this.size()] ?? 'h-8 w-8';
  }

  containerClass(): string {
    const map: Record<string, string> = { sm: 'py-2', md: 'py-8', lg: 'py-12' };
    return map[this.size()] ?? 'py-8';
  }
}
