import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Max-width centered content wrapper with optional heading. */
@Component({
  selector: 'app-page-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <div class="mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="mt-1 text-sm text-muted">{{ subtitle() }}</p>
        }
      </div>
    }
    <ng-content />
  `,
})
export class PageContainerComponent {
  title = input<string>();
  subtitle = input<string>();
}
