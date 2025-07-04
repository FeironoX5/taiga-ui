import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TUI_ANIMATIONS_SPEED, TuiRoot, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';
import {createOutputSpy} from 'cypress/angular';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        TuiChevron,
        TuiDataListWrapper,
        TuiRoot,
        TuiSelect,
        TuiTextfield,
    ],
    template: `
        <tui-root>
            <tui-textfield tuiChevron>
                <input
                    tuiSelect
                    [(ngModel)]="value"
                />

                <tui-data-list-wrapper
                    *tuiTextfieldDropdown
                    new
                    [items]="options"
                    (itemClick)="itemClick.emit($event)"
                />
            </tui-textfield>
        </tui-root>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{provide: TUI_ANIMATIONS_SPEED, useValue: 0}],
})
export class TestSelect {
    protected readonly options = new Array(5).fill(null).map((_, i) => `Option ${i}`);

    protected value: string | null = this.options[0]!;

    @Output()
    public readonly itemClick = new EventEmitter<string>();
}

describe('Select', () => {
    beforeEach(() => cy.viewport(300, 350));

    describe('checked state of option', () => {
        beforeEach(() => {
            cy.mount(TestSelect);
        });

        it('form control has initial value => initial option has check mark', () => {
            cy.get('[tuiSelect]').click();

            cy.compareSnapshot('select-form-control-has-initial-value-option-checked');
        });

        it('select new option from datalist => new option has check mark', () => {
            cy.get('[tuiSelect]').click();
            cy.get('[tuiOption]').last().click();
            cy.get('[tuiSelect]').click();

            cy.compareSnapshot('select-new-selected-option-checked');
        });
    });

    describe('DataListWrapper', () => {
        beforeEach(() => {
            cy.mount(TestSelect, {
                componentProperties: {itemClick: createOutputSpy('itemClick')},
            });
        });

        it('emits (itemClick) on the first option click ', () => {
            cy.get('[tuiSelect]').click();
            cy.get('[tuiOption]').first().click();

            cy.get('@itemClick').should('have.been.calledWith', 'Option 0');
        });

        it('emits (itemClick) on the last option click ', () => {
            cy.get('[tuiSelect]').click();
            cy.get('[tuiOption]').last().click();

            cy.get('@itemClick').should('have.been.calledWith', 'Option 4');
        });
    });
});
