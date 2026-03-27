import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Notification banner for success, error, warning, or info messages. */
@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ' + colorClasses()" role="alert">
      <div class="flex-1">
        <ng-content />
      </div>
    </div>
  `,
})
export class AlertComponent {
  type = input<'success' | 'error' | 'warning' | 'info'>('info');

  colorClasses(): string {
    const map: Record<string, string> = {
      success: 'border-success-500/30 bg-success-50 text-success-700',
      error: 'border-danger-500/30 bg-danger-50 text-danger-700',
      warning: 'border-warning-500/30 bg-warning-50 text-warning-700',
      info: 'border-primary-500/30 bg-primary-50 text-primary-700',
    };
    return map[this.type()] ?? map['info'];
  }
}
