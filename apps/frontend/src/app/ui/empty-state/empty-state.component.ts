import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Empty list placeholder with title, description, and action slot. */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-16 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      </div>
      <h3 class="mt-4 text-base font-semibold text-gray-900">{{ title() }}</h3>
      @if (description()) {
        <p class="mt-1 text-sm text-muted">{{ description() }}</p>
      }
      <div class="mt-6">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input<string>();
}
