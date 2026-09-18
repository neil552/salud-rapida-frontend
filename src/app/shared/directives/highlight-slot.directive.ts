import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[appHighlightSlot]',
  host: {
    '[class.slot-highlighted]': 'appHighlightSlot()'
  }
})
export class HighlightSlotDirective {
  // La transformación permite usar el atributo como booleano desde una plantilla.
  readonly appHighlightSlot = input(false, { transform: booleanAttribute });
}
