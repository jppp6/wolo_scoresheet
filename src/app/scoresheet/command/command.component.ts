import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, map, startWith } from 'rxjs';
import { Events } from 'src/app/core/actions/info.actions';
import { WoloState } from 'src/app/core/states/state';
import { HelpDialog } from '../help/help.component';

@Component({
    selector: 'app-command',
    templateUrl: './command.component.html',
    styleUrls: [],
})
export class CommandComponent {
    @Select(WoloState.gameScore) $gameScore!: Observable<string>;

    command = new FormControl('');
    options: Observable<string[]> = new Observable();

    constructor(private store: Store, private dialog: MatDialog) {}

    readonly quarterPattern = /^q|quarter$/;
    readonly gameDonePattern = /^game done$/;
    readonly goalPattern =
        /^([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)(g|goal)(\d{1,3})$/;
    readonly timeoutPattern =
        /^(t|timeout)(d|dark|a|away|l|light|h|home)(\d{1,3})$/;
    readonly redCardPattern =
        /^([1-9]|1\d|20|coach|c|assistant1|a1|assistant2|a2)(d|dark|a|away|l|light|h|home)(r|red)(\d{1,3})$/;
    readonly yellowCardPattern =
        /^([1-9]|1\d|20|coach|c|assistant1|a1|assistant2|a2)(d|dark|a|away|l|light|h|home)(y|yellow)(\d{1,3})$/;
    readonly capSwapPattern =
        /^([1-9]|1\d|20)(s|swap)([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)(\d{1,3})$/;
    readonly exclusionPattern =
        /^([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)(e|exclusion)(\d{1,3})$/;
    readonly brutalityPattern =
        /^([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)(b|brutality)(\d{1,3})$/;

    ngOnInit() {
        this.options = this.command.valueChanges.pipe(
            startWith(''),
            map((value) => {
                if (!value) {
                    return [
                        '(?cap?)',
                        'coach',
                        'assistant1',
                        'assistant2',
                        'quarter',
                    ];
                }
                value = value.toLowerCase();
                if (/^([1-9]|1\d|20)$/.test(value)) {
                    return [value + 'home', value + 'away', value + 'swap'];
                } else if (
                    /^([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)$/.test(value)
                ) {
                    return [
                        value + 'goal',
                        value + 'exclusion',
                        value + 'brutality',
                        value + 'yellow',
                        value + 'red',
                    ];
                } else if (
                    /^([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)(g|goal|e|exclusion|b|brutality)$/.test(
                        value
                    )
                ) {
                    return [value + '(?time?)'];
                } else if (/^(t|to|timeout|time)$/.test(value)) {
                    return [value + 'home', value + 'away'];
                } else if (
                    /^(t|timeout)(d|dark|a|away|l|light|h|home)$/.test(value)
                ) {
                    return [value + '(?time?)'];
                } else if (/^([1-9]|1\d|20)(s|swap)$/.test(value)) {
                    return [value + '(?cap?)'];
                } else if (
                    /^([1-9]|1\d|20)(s|swap)([1-9]|1\d|20)$/.test(value)
                ) {
                    return [value + 'home', value + 'away'];
                } else if (
                    /^([1-9]|1\d|20)(s|swap)([1-9]|1\d|20)(d|dark|a|away|l|light|h|home)$/.test(
                        value
                    )
                ) {
                    return [value + '(?time?)'];
                } else if (
                    /^(coach|c|assistant1|a1|assistant2|a2)$/.test(value)
                ) {
                    return [value + 'home', value + 'away'];
                } else if (
                    /^([1-9]|1\d|20|coach|c|assistant1|a1|assistant2|a2)(d|dark|a|away|l|light|h|home)$/.test(
                        value
                    )
                ) {
                    return [value + 'yellow', value + 'red'];
                } else if (
                    /^([1-9]|1\d|20|coach|c|assistant1|a1|assistant2|a2)(d|dark|a|away|l|light|h|home)(y|yellow|r|red)$/.test(
                        value
                    )
                ) {
                    return [value + '(?time?)'];
                } else {
                    return [];
                }
            })
        );
    }

    parseCommand(): void {
        if (!this.command.value) {
            return;
        }
        const v = this.command.value.toLowerCase();

        if (this.goalPattern.test(v)) {
            const m = v.match(this.goalPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Goal(m[1], this.colorP(m[2]), this.timeP(m[4]))
            );
        } else if (this.quarterPattern.test(v)) {
            this.store.dispatch(new Events.Quarter());
        } else if (this.timeoutPattern.test(v)) {
            const m = v.match(this.timeoutPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Timeout(this.colorP(m[2]), this.timeP(m[3]))
            );
        } else if (this.redCardPattern.test(v)) {
            const m = v.match(this.redCardPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Card(
                    this.coachP(m[1]),
                    this.colorP(m[2]),
                    'red',
                    this.timeP(m[4])
                )
            );
        } else if (this.yellowCardPattern.test(v)) {
            const m = v.match(this.yellowCardPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Card(
                    this.coachP(m[1]),
                    this.colorP(m[2]),
                    'yellow',
                    this.timeP(m[4])
                )
            );
        } else if (this.capSwapPattern.test(v)) {
            const m = v.match(this.capSwapPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.CapSwap(
                    m[1],
                    m[3],
                    this.colorP(m[4]),
                    this.timeP(m[5])
                )
            );
        } else if (this.exclusionPattern.test(v)) {
            const m = v.match(this.exclusionPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Exclusion(m[1], this.colorP(m[2]), this.timeP(m[4]))
            );
        } else if (this.brutalityPattern.test(v)) {
            const m = v.match(this.brutalityPattern);
            if (!m) {
                return;
            }
            this.store.dispatch(
                new Events.Brutality(m[1], this.colorP(m[2]), this.timeP(m[4]))
            );
        } else if (this.gameDonePattern.test(v)) {
            // this.store.dispatch(
            //     new Game.Done(m[1], this.colorP(m[2]), this.timeP(m[4]))
            // );
        } else {
            return;
        }
        this.command.reset();
    }

    coachP(e: string): string {
        return ['coach', 'hc', 'c'].includes(e)
            ? 'Head Coach'
            : ['assistant1', 'a1', 'ac1'].includes(e)
            ? 'Assistant 1'
            : ['assistant2', 'a2', 'ac2'].includes(e)
            ? 'Assistant 2'
            : e;
    }

    timeP(e: string): string {
        return 1 === e.length
            ? `0:0${e}`
            : 2 === e.length
            ? `0:${e}`
            : 3 === e.length
            ? `${e[0]}:${e.substring(1)}`
            : '';
    }

    colorP(e: string): 'home' | 'away' {
        return ['b', 'blue', 'd', 'dark', 'a', 'away'].includes(e)
            ? 'away'
            : 'home';
    }

    openHelpPage(): void {
        this.dialog.open(HelpDialog, {
            width: '600px',
        });
    }
}
