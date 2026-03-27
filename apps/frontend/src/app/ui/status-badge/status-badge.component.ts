import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Colored badge indicating file processing status. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ' + colorClasses()">
      <span [class]="'h-1.5 w-1.5 rounded-full ' + dotClass()"></span>
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<string>();

  label = computed(() => {
    const s = this.status();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  });

  colorClasses(): string {
    const map: Record<string, string> = {
      UPLOADED: 'bg-gray-100 text-gray-700',
      QUEUED: 'bg-primary-50 text-primary-700',
      PROCESSING: 'bg-warning-50 text-warning-700',
      COMPLETED: 'bg-success-50 text-success-700',
      FAILED: 'bg-danger-50 text-danger-700',
    };
    return map[this.status()] ?? 'bg-gray-100 text-gray-700';
  }

  dotClass(): string {
    const map: Record<string, string> = {
      UPLOADED: 'bg-gray-400',
      QUEUED: 'bg-primary-500',
      PROCESSING: 'bg-warning-500',
      COMPLETED: 'bg-success-500',
      FAILED: 'bg-danger-500',
    };
    return map[this.status()] ?? 'bg-gray-400';
  }
}
