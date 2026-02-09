/**
 * Krāsu nosaukumu tulkojums no angļu uz latviešu valodu.
 * Ja krāsa nav mapē, atgriež oriģinālo vērtību.
 */
const COLOR_LV: Record<string, string> = {
    Black: 'Melns',
    Blue: 'Zils',
    Green: 'Zaļš',
    Grey: 'Pelēks',
    Gray: 'Pelēks',
    Red: 'Sarkans',
    Yellow: 'Dzeltenš',
    White: 'Balts',
    Orange: 'Oranžs',
    Celeste: 'Celeste',
    Navy: 'Tumši zils',
}

export function colorToLatvian(color: string): string {
    return COLOR_LV[color] ?? color
}
