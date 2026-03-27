import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Label + input wrapper with optional error display. */
@Component({
  selector: 'app-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1.5">
      @if (label()) {
        <label [for]="fieldId()" class="block text-sm font-medium text-gray-700">
          {{ label() }}
          @if (required()) {
            <span class="text-danger-500">*</span>
          }
        </label>
      }
      <ng-content />
      @if (error()) {
        <p class="text-xs font-medium text-danger-500">{{ error() }}</p>
      }
    </div>
  `,
})
export class FormFieldComponent {
  label = input<string>();
  fieldId = input<string>('');
  error = input<string>();
  required = input(false);
}
