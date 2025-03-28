export const MAP_SETTINGS = {
    DEFAULT_ZOOM: 6,
    DEFAULT_CENTER: [53.328248, 108.837283], // Центр Бурятии
    MAX_ZOOM: 18,
    OBJECT_FOCUS_ZOOM: 18,
    ANIMATION_DURATION: 1.5 // секунды
}

export const TILE_LAYERS = [
    {
        name: 'Схема',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: 'abc',
    },
    {
        name: 'Спутник',
        url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
    {
        name: 'Гибрид',
        url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
]