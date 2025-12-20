import { MenuConfig } from '../../shared/interfaces/menu.interface';

export const DASHBOARD3_MENU_CONFIG: MenuConfig = {
    id: 'dashboard3-menu',
    name: 'Dashboard 3 Menu',
    items: [
        {
            id: 'home',
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            type: 'group',
            order: 1,
            items: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['/'],
                    type: 'item',
                    order: 1
                },
                {
                    id: 'crud',
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud'],
                    type: 'item',
                    order: 1
                }
            ]
        },
        {
            id: 'ui-components',
            label: 'UI Components',
            icon: 'pi pi-fw pi-palette',
            type: 'group',
            order: 2,
            items: [
                {
                    id: 'form-layout',
                    label: 'Form Layout',
                    icon: 'pi pi-fw pi-id-card',
                    routerLink: ['/uikit/formlayout'],
                    type: 'item',
                    order: 1
                },
                {
                    id: 'input',
                    label: 'Input',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/uikit/input'],
                    type: 'item',
                    order: 2
                },
                {
                    id: 'button',
                    label: 'Button',
                    icon: 'pi pi-fw pi-mobile',
                    routerLink: ['/uikit/button'],
                    type: 'item',
                    order: 3
                },
                {
                    id: 'table',
                    label: 'Table',
                    icon: 'pi pi-fw pi-table',
                    routerLink: ['/uikit/table'],
                    type: 'item',
                    order: 4
                },
                {
                    id: 'list',
                    label: 'List',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/uikit/list'],
                    type: 'item',
                    order: 5
                },
                {
                    id: 'tree',
                    label: 'Tree',
                    icon: 'pi pi-fw pi-share-alt',
                    routerLink: ['/uikit/tree'],
                    type: 'item',
                    order: 6
                },
                {
                    id: 'panel',
                    label: 'Panel',
                    icon: 'pi pi-fw pi-tablet',
                    routerLink: ['/uikit/panel'],
                    type: 'item',
                    order: 7
                },
                {
                    id: 'overlay',
                    label: 'Overlay',
                    icon: 'pi pi-fw pi-clone',
                    routerLink: ['/uikit/overlay'],
                    type: 'item',
                    order: 8
                },
                {
                    id: 'media',
                    label: 'Media',
                    icon: 'pi pi-fw pi-image',
                    routerLink: ['/uikit/media'],
                    type: 'item',
                    order: 9
                },
                {
                    id: 'menu',
                    label: 'Menu',
                    icon: 'pi pi-fw pi-bars',
                    routerLink: ['/uikit/menu'],
                    type: 'item',
                    order: 10
                },
                {
                    id: 'message',
                    label: 'Message',
                    icon: 'pi pi-fw pi-comment',
                    routerLink: ['/uikit/message'],
                    type: 'item',
                    order: 11
                },
                {
                    id: 'file',
                    label: 'File',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/uikit/file'],
                    type: 'item',
                    order: 12
                },
                {
                    id: 'chart',
                    label: 'Chart',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/uikit/charts'],
                    type: 'item',
                    order: 13
                },
                {
                    id: 'timeline',
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/uikit/timeline'],
                    type: 'item',
                    order: 14
                },
                {
                    id: 'misc',
                    label: 'Misc',
                    icon: 'pi pi-fw pi-circle',
                    routerLink: ['/uikit/misc'],
                    type: 'item',
                    order: 15
                }
            ]
        },
        {
            id: 'pages',
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            type: 'group',
            order: 3,
            items: [
                {
                    id: 'landing',
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing'],
                    type: 'item',
                    order: 1
                },
                {
                    id: 'auth',
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    type: 'group',
                    order: 2,
                    items: [
                        {
                            id: 'login',
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            routerLink: ['/auth/login'],
                            type: 'item',
                            order: 1
                        },
                        {
                            id: 'error',
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            routerLink: ['/auth/error'],
                            type: 'item',
                            order: 2
                        },
                        {
                            id: 'access-denied',
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/auth/access'],
                            type: 'item',
                            order: 3
                        }
                    ]
                },
                {
                    id: 'crud',
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud'],
                    type: 'item',
                    order: 3,
                    permissions: ['pages.crud.read']
                },
                {
                    id: 'menu-demo',
                    label: 'Menu Demo',
                    icon: 'pi pi-fw pi-bars',
                    routerLink: ['/menu-demo'],
                    type: 'item',
                    order: 4
                },
                {
                    id: 'not-found',
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/pages/notfound'],
                    type: 'item',
                    order: 5
                },
                {
                    id: 'empty',
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: ['/pages/empty'],
                    type: 'item',
                    order: 6
                }
            ]
        },
        {
            id: 'hierarchy',
            label: 'Hierarchy',
            icon: 'pi pi-fw pi-sitemap',
            type: 'group',
            order: 4,
            items: [
                {
                    id: 'submenu-1',
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    type: 'group',
                    order: 1,
                    items: [
                        {
                            id: 'submenu-1-1',
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            type: 'group',
                            order: 1,
                            items: [
                                {
                                    id: 'submenu-1-1-1',
                                    label: 'Submenu 1.1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 1
                                },
                                {
                                    id: 'submenu-1-1-2',
                                    label: 'Submenu 1.1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 2
                                },
                                {
                                    id: 'submenu-1-1-3',
                                    label: 'Submenu 1.1.3',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 3
                                }
                            ]
                        },
                        {
                            id: 'submenu-1-2',
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            type: 'group',
                            order: 2,
                            items: [
                                {
                                    id: 'submenu-1-2-1',
                                    label: 'Submenu 1.2.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 1
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'submenu-2',
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    type: 'group',
                    order: 2,
                    items: [
                        {
                            id: 'submenu-2-1',
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            type: 'group',
                            order: 1,
                            items: [
                                {
                                    id: 'submenu-2-1-1',
                                    label: 'Submenu 2.1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 1
                                },
                                {
                                    id: 'submenu-2-1-2',
                                    label: 'Submenu 2.1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 2
                                }
                            ]
                        },
                        {
                            id: 'submenu-2-2',
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            type: 'group',
                            order: 2,
                            items: [
                                {
                                    id: 'submenu-2-2-1',
                                    label: 'Submenu 2.2.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    type: 'item',
                                    order: 1
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'get-started',
            label: 'Get Started',
            icon: 'pi pi-fw pi-info-circle',
            type: 'group',
            order: 5,
            items: [
                {
                    id: 'documentation',
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/documentation'],
                    type: 'item',
                    order: 1
                },
                {
                    id: 'view-source',
                    label: 'View Source',
                    icon: 'pi pi-fw pi-github',
                    url: 'https://github.com/primefaces/sakai-ng',
                    target: '_blank',
                    type: 'item',
                    order: 2
                }
            ]
        }
    ],
    theme: 'light',
    orientation: 'vertical',
    collapsible: true,
    showIcons: true,
    showBadges: true,
    maxDepth: 4
}; 