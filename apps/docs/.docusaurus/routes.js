import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', '714'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'e3f'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '095'),
            routes: [
              {
                path: '/docs/about',
                component: ComponentCreator('/docs/about', '97c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/adapters/',
                component: ComponentCreator('/docs/adapters/', '85d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/adapters/anthropic',
                component: ComponentCreator('/docs/adapters/anthropic', 'acb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/adapters/openai',
                component: ComponentCreator('/docs/adapters/openai', '0ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cli/',
                component: ComponentCreator('/docs/cli/', '043'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cli/api',
                component: ComponentCreator('/docs/cli/api', '498'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cli/usage',
                component: ComponentCreator('/docs/cli/usage', 'c0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client-sdk/',
                component: ComponentCreator('/docs/client-sdk/', '8f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client-sdk/api',
                component: ComponentCreator('/docs/client-sdk/api', '7f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client-sdk/usage',
                component: ComponentCreator('/docs/client-sdk/usage', '091'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/eco-system',
                component: ComponentCreator('/docs/eco-system', 'e3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introspection',
                component: ComponentCreator('/docs/introspection', '31c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/type-generation',
                component: ComponentCreator('/docs/type-generation', '102'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
