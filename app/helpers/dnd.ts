import {DoNotDisturbService} from '../services/do_not_disturb_service';
import {Duration} from '../services/dnd/duration';
import {HOURS, MINUTES} from '../services/dnd/duration_unit';

export function setUpDnd(
    dndService: DoNotDisturbService
) {
    const durations: Map<Duration, string> = new Map();
    durations.set(new Duration(10, MINUTES), '10 minutes');
    durations.set(new Duration(30, MINUTES), '30 minutes');
    durations.set(new Duration(1, HOURS), '1 hour');
    durations.set(new Duration(4, HOURS), '4 hours');
    durations.set(new Duration(8, HOURS), '8 hours');

    const parentMenuId = 'DND__parentMenu';
    chrome.contextMenus.create({
        id: parentMenuId,
        title: 'Do not disturb',
        contexts: ['browser_action']
    });

    chrome.contextMenus.create({
        id: 'DND__off',
        title: 'Turn off',
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

    durations.forEach((label, duration) => {
        chrome.contextMenus.create({
            id: `DND__${duration}`,
            title: label,
            contexts: ['browser_action'],
            parentId: parentMenuId,
            onclick: () => dndService.turnOnDnd(duration)
        });
    });
}
