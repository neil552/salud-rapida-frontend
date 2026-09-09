import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[appHighlightSlot]',
  host: {
    '[class.slot-highlighted]': 'appHighlightSlot()'
  }
})
export class HighlightSlotDirective {
  readonly appHighlightSlot = input(false, { transform: booleanAttribute });
}
