# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Products Image Zoom',
    'version': '1.0',
    'summary': 'Zoom product image to full screen view on your E-commerce website',
    'description': """
    Zoom product image to full screen view on your E-commerce website.
    """,
    'sequence': 30,
    'category': 'eCommerce',
    'author': 'Synconics Technologies Pvt. Ltd.',
    'website': 'www.synconics.com',
    'depends': ['website_sale'],
    'data': [
        'views/assets_registry.xml',
        'views/templates.xml',
    ],
    'images': [
        'static/description/main_screen.png'
    ],
    'price': 10.0,
    'currency': 'EUR',
    'application': True,
    'auto_install': False,
    'installable': True,
    'license': 'OPL-1',
}
