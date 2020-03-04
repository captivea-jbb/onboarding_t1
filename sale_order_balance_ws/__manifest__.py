# -*- coding: utf-8 -*-
{
    'name': 'Customer Balance in Sale Order',
    'version': '1.0',
    'category': 'Tools',
    'author':'Craftsync Technologies',
    'maintainer': 'Craftsync Technologies',
    'website' : 'https://www.craftsync.com',
    'summary': 'Check for your customer balance on Sale Order',
    'license': 'OPL-1',
    'support':'info@craftsync.com',
    'sequence': 1,
    'depends': [
        'sale'
    ],
    'data': [
       'views/sale_order.xml'
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'images': ['static/description/main_screen.png'],
    'price': 10.00,
    'currency': 'EUR',
}
