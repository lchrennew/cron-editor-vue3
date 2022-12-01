import Minutes from "./cycles/Minutes.vue";
import Hourly from "./cycles/Hourly.vue";
import Daily from "./cycles/Daily.vue";
import Weekly from "./cycles/Weekly.vue";
import Monthly from "./cycles/Monthly.vue";

const weekdayNames = '日一二三四五六日'
const humanizeTime =
    (hour, minute) => `${hour.padStart(2, '0')}时${(Number(minute) ? `${minute.padStart(2, '0')}分` : '')}`
const humanizeEvery =
    (every, unit='个') => `每${Number(every) === 1 ? '' : `${every}${unit}`}`
export const modes = [
    {
        name: '分钟',
        key: 'Minutes',
        component: Minutes,
        default: '0 0/1 * 1/1 * ?',
        patterns: [ /^0 0\/(?<every>\d+) \* 1\/1 \* \?$/ ],
        humanize: [ ({ every }) => `${humanizeEvery(every, '')}分钟` ]
    },
    {
        name: '小时',
        key: 'Hourly',
        component: Hourly,
        default: '0 0 0/1 1/1 * ?',
        patterns: [ /^0 0 0\/(?<every>\d+) 1\/1 \* \?$/ ],
        humanize: [ ({ every }) =>  `${humanizeEvery(every)}小时` ]
    },
    {
        name: '天',
        key: 'Daily',
        component: Daily,
        default: '0 0 0 1/1 * ?',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) 1\/1 \* \?$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? \* (?<weekday>1-5)$/,
        ],
        humanize: [
            ({ hour, minute }) => `每天 ${humanizeTime(hour, minute)}`,
            ({ hour, minute }) => `除周末外，每天 ${humanizeTime(hour, minute)}`,
        ]
    },
    {
        name: '周',
        key: 'Weekly',
        component: Weekly,
        default: '0 0 0 ? * 1',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) \? \* (?<weekdays>\d(?:,\d){0,6})$/,
        ],
        humanize: [
            ({ hour, minute, weekdays }) =>
                `每周 ${weekdays.split(',').map(i => weekdayNames[i]).join('、')} ${humanizeTime(hour, minute)}`
        ]
    },
    {
        name: '月',
        key: 'Monthly',
        component: Monthly,
        default: '0 0 0 1 1/1 ?',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) (?<day>\d+)(?<last>L)? 1\/(?<every>\d+) \?$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? 1\/(?<every>\d+) (?<weekday>\d)(?<nth>#[1-5])$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? 1\/(?<every>\d+) (?<weekday>\d)(?<nth>L)$/,
        ],
        humanize: [
            ({ hour, minute, day, last, every }) =>
                `${humanizeEvery(every)}月${last ? '倒数' : ''}第${day}天 ${humanizeTime(hour, minute)}`,
            ({ hour, minute, every, weekday, nth }) =>
                `${humanizeEvery(every)}月第${nth.substring(1)}个周${weekdayNames[weekday]} ${humanizeTime(hour, minute)}`,
            ({ hour, minute, every, weekday }) =>
                `${humanizeEvery(every)}月最后一个周${weekdayNames[weekday]} ${humanizeTime(hour, minute)}`,
        ],
    },
]