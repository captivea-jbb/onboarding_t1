
from odoo import api, fields, models, _
from odoo.exceptions import UserError

from dateutil.relativedelta import relativedelta

class SignatureRequest(models.Model):
  _inherit = "sign.request"
  
  @api.multi
  def action_customer_view(self):
    return {
       	'name': 'Customer View',
	'res_model': 'ir.actions.act_url',
       	'type': 'ir.actions.act_url',
       	'url': self['x_url_to_sign'],
       	'target':'new',
       	}
	
  @api.multi
  def action_employee_view(self):
    return {
       	'name': 'Customer View',
	'res_model': 'ir.actions.act_url',
       	'type': 'ir.actions.act_url',
       	'url': self['x_url_to_sign_employee'],
       	'target':'new',
    }
    
  @api.multi
  def action_send_emails(self):
    self.state = 'draft'
	
    for request_item in self.request_item_ids:
      request_item.write({'state':'draft'})
    self.action_sent("Signature Request", "")
    return True
