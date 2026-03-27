import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Elevated surface container with optional padding variants. */
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="'rounded-xl border border-border bg-surface-raised shadow-sm ' + paddingClass()"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  paddingClass(): string {
    const map: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    return map[this.padding()] ?? 'p-6';
  }
}
