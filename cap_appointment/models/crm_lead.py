# coding: utf-8
# Part of CAPTIVEA. Odoo 11 EE.

from odoo import api, models
from odoo.exceptions import UserError


class CRMLead(models.Model):
    """Manage 'crm.lead' model. Overriding model."""
    _inherit = "crm.lead"

    ##################
    # HEADER BUTTONS #
    ##################

    @api.multi
    def start_appointment(self):
        """Return the appointment view of one 'crm.lead'."""
        self.ensure_one()
        view_id = self.env['ir.ui.view'].search([("name", "=", "crm.lead.form.opportunity.appointment")], limit=1)
        if not view_id:
            return UserError("View 'crm.lead.form.opportunity.appointment' not found.")
        action = {
            "type": "ir.actions.act_window",
            "res_model": "crm.lead",
            "view_type": "form",
            "view_mode": "form",
            "view_id": view_id.id,
            "res_id": self.id,
            "target": "fullscreen"
        }
        return action
