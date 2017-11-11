import {DoNotDisturbService} from '../services/do_not_disturb_service';
import {Duration} from '../services/dnd/duration';
import {HOURS, MINUTES} from '../services/dnd/duration_unit';

export function setUpDnd(
    dndService: DoNotDisturbService,
    $translate: angular.translate.ITranslateService
) {
    const durations: Set<Duration> = new Set();
    durations.add(new Duration(10, MINUTES));
    durations.add(new Duration(30, MINUTES));
    durations.add(new Duration(1, HOURS));
    durations.add(new Duration(4, HOURS));
    durations.add(new Duration(8, HOURS));

    const parentMenuId = 'DND__parentMenu';
    chrome.contextMenus.create({
        id: parentMenuId,
        title: $translate.instant('DND.TITLE'),
        contexts: ['browser_action']
    });

    chrome.contextMenus.create({
        id: 'DND__off',
        title: $translate.instant('DND.TURN_OFF'),
        contexts: ['browser_action'],
        checked: true,
        parentId: parentMenuId,
        onclick: () => dndService.turnOffDnd()
    });

    chrome.contextMenus.create({
        id: 'DND_eparator',
        type: 'separator',
        parentId: parentMenuId,
        contexts: ['browser_action']
    });

    durations.forEach((duration) => {
        chrome.contextMenus.create({
            id: `DND__${duration}`,
            title: $translate.instant(
                `DND.DURATION.${duration.unit.toUpperCase()}`,
                {VAL: duration.value}
            ),
            contexts: ['browser_action'],
            parentId: parentMenuId,
            onclick: () => dndService.turnOnDnd(duration)
        });
    });
}
