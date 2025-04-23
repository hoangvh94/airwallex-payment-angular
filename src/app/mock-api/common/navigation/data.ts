/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // }
    {
        id: 'dashboards',
        title: 'Dashboards',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.analytics',
                title: 'Analytics',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
        ],
    },
    {
        id: 'apps',
        title: 'Applications',
        subtitle: 'Custom made application designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.ecommerce',
                title: 'ECommerce',
                type: 'collapsable',
                icon: 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Inventory',
                        type: 'basic',
                        link: '/apps/ecommerce/inventory',
                    },
                ],
            },
            {
                id: 'apps.file-manager',
                title: 'File Manager',
                type: 'basic',
                icon: 'heroicons_outline:cloud',
                link: '/apps/file-manager',
            },
            {
                id: 'apps.help-center',
                title: 'Help Center',
                type: 'collapsable',
                icon: 'heroicons_outline:information-circle',
                link: '/apps/help-center',
                children: [
                    {
                        id: 'apps.help-center.home',
                        title: 'Home',
                        type: 'basic',
                        link: '/apps/help-center',
                        exactMatch: true,
                    },
                    {
                        id: 'apps.help-center.faqs',
                        title: 'FAQs',
                        type: 'basic',
                        link: '/apps/help-center/faqs',
                    },
                    {
                        id: 'apps.help-center.guides',
                        title: 'Guides',
                        type: 'basic',
                        link: '/apps/help-center/guides',
                    },
                    {
                        id: 'apps.help-center.support',
                        title: 'Support',
                        type: 'basic',
                        link: '/apps/help-center/support',
                    },
               
                ],
            },
            {
                id: 'example',
                title: 'Example',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/apps/example',
            },
            {
                id: 'motor',
                title: 'Motor AI',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/apps/motor',
            },
        ],
    },
    {
        id: 'pages',
        title: 'Pages',
        subtitle: 'Custom made page designs',
        type: 'group',
        icon: 'heroicons_outline:document',
        children: [
            {
                id: 'pages.pricing',
                title: 'Pricing',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/pages/pricing',
            },
            {
                id: 'pages.settings',
                title: 'Settings',
                type: 'basic',
                icon: 'heroicons_outline:cog-8-tooth',
                link: '/pages/settings',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
