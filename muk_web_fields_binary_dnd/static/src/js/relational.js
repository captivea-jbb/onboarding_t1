/**********************************************************************************
* 
*   Copyright (C) 2018 MuK IT GmbH
*    		
*   Odoo Proprietary License v1.0
*   This software and associated files (the "Software") may only be used 
*	(executed, modified, executed after modifications) if you have
*	purchased a valid license from the authors, typically via Odoo Apps,
*	or if you have received a written agreement from the authors of the
*	Software (see the COPYRIGHT file).
*	
*	You may develop Odoo modules that use the Software as a library 
*	(typically by depending on it, importing it and using its resources),
*	but without copying any source code or material from the Software.
*	You may distribute those modules under the license of your choice,
*	provided that this license is compatible with the terms of the Odoo
*	Proprietary License (For example: LGPL, MIT, or proprietary licenses
*	similar to this one).
*	
*	It is forbidden to publish, distribute, sublicense, or sell copies of
*	the Software or modified copies of the Software.
*	
*	The above copyright notice and this permission notice must be included
*	in all copies or substantial portions of the Software.
*	
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
*	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
*	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
*	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
*	DEALINGS IN THE SOFTWARE.
*
**********************************************************************************/

odoo.define('muk_web_fields_binary_dnd.relational', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var session = require('web.session');
var dialogs = require('web.view_dialogs');
var fields = require('web.relational_fields');
var crash_manager = require('web.crash_manager');

var utils = require('muk_web_utils.files');
var async = require('muk_web_utils.async');
var dropzone = require('muk_web_utils.dropzone');

var _t = core._t;
var QWeb = core.qweb;

fields.FieldMany2ManyBinaryMultiFiles.include(_.extend({}, dropzone.FileDropzoneMixin, {
	dropzoneClasses: dropzone.FileDropzoneMixin.dropzoneClasses.concat([
		'mk_dropzone_attachments'
	]),
	_render: function () {
		this._super.apply(this, arguments);
		if (this.mode === 'edit') {
			this._startDropzone(this.$('.oe_attachments'));
			if(!$.trim(this.$('.oe_attachments').html())) {
				this.$('.oe_attachments').addClass('mk_attachments_empty');
			} else {
				this.$('.oe_attachments').removeClass('mk_attachments_empty');
			}
        } else {
        	this._destroyDropzone();
        }
    },
    _handleDrop: function(event) {
    	var dataTransfer = event.originalEvent.dataTransfer;
    	if (dataTransfer.items && dataTransfer.items.length > 0) {
    		this._uploadAttachments(dataTransfer.items);
    	}
	},
	_uploadAttachment: function(file) {
    	var def = $.Deferred();
    	utils.readFile(file, function (upload) {
    		var data = upload.target.result.split(',')[1];
	        this._rpc({
	            model: 'ir.attachment',
	            method: 'create',
	            args: [{
	                'type': "binary",
	                'name': file.name,
	                'datas': data,
	                'datas_fname': file.name,
	                'res_model': this.model,
	                'res_id': 0,
	            }],
	            context: session.user_context
	        }).then(function (result) {
	        	def.resolve(result);
	        });
    	}.bind(this));
    	return def;
    },
	_cleanAttachments: function(files) {
		var promises  = [];
    	var def = $.Deferred();
		var data = this.value.data;
    	var attachment_ids = this.value.res_ids;
		_.each(files, function(file, index) {
			var record = _.find(data, function (attachment) {
			    return attachment.data.name === file.name;
			});
			if (record) {
			    var metadata = this.metadata[record.id];
			    if (!metadata || metadata.allowUnlink) {
			        var unlink = this._rpc({
			            model: 'ir.attachment',
			            method: 'unlink',
			            args: [record.res_id],
			        });
			        attachment_ids = _.without(
			        	attachment_ids,
			        	record.res_id
			        );
			        promises.push(unlink);
			    }
			}
		}.bind(this));
		$.when.apply($, promises).then(function () {
			def.resolve(attachment_ids);
		}.bind(this));
		return def;
	},
    _uploadAttachments: function(items) {
    	utils.getFileList(items, true).then(function(res) {
    		this.uploadingFiles = _.map(res.files, function(file) {
    			return { name: file.name }; 
    		});
    		this._cleanAttachments(res.files).then(function (ids) {
    			var attachment_ids = ids;
    			var upload = function(file) {
    				return this._uploadAttachment(file).then(function(id) {
        				attachment_ids = _.union(attachment_ids, [id]);
        				this.uploadingFiles.shift();
                		this._setValue({
            	            operation: 'REPLACE_WITH',
            	            ids: attachment_ids,
            	        });
        			}.bind(this));
        	    }.bind(this);
        	    var finish = function() {
    		    	this.uploadingFiles = [];
    		    	this._setValue({
    		            operation: 'REPLACE_WITH',
    		            ids: attachment_ids,
    		        });
			    }.bind(this);
        		this._setValue({
    	            operation: 'REPLACE_WITH',
    	            ids: attachment_ids,
    	        });
    			async.syncLoop(res.files, upload, finish);
    		}.bind(this));
		}.bind(this));
    },
	destroy: function () {
		var res = this._super.apply(this, arguments);
		this._destroyDropzone();
        return res;
    },
}));

});