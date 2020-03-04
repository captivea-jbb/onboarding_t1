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

odoo.define('muk_web_fields_binary_dnd.mixin', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var session = require('web.session');
var dialogs = require('web.view_dialogs');
var crash_manager = require('web.crash_manager');

var utils = require('muk_web_utils.files');
var dropzone = require('muk_web_utils.dropzone');

var _t = core._t;
var QWeb = core.qweb;

var BinaryDropzoneMixin = _.extend({}, dropzone.FileDropzoneMixin, {
	_checkDropzoneEvent: function(event) {
		var dataTransfer = event.originalEvent && event.originalEvent.dataTransfer;
		var sizeCheck = dataTransfer && dataTransfer.items.length == 1;
		var typeCheck = dataTransfer && dataTransfer.types[0] == "Files";
		return this.dropzoneCheck && sizeCheck && typeCheck;
	},
	_handleDrop: function(event) {
		var dataTransfer = event.originalEvent.dataTransfer;
		if (dataTransfer.files && dataTransfer.files.length == 1) {
			var file = dataTransfer.files[0];
			if (file.size > this.max_upload_size) {
                var msg = _t("The selected file exceed the maximum file size of %s.");
                this.do_warn(_t("File upload"), _.str.sprintf(msg, utils.human_size(this.max_upload_size)));
            } else {
    			utils.readFile(file, this._onDropUpload.bind(this, file));
    	        this.$('.o_form_binary_progress').show();
    	        this.$('button').hide();
            }
		}
	},
	_onDropUpload: function(file, upload) {
		var data = upload.target.result.split(',')[1];
		this.on_file_uploaded(file.size, file.name, file.type, data);
	},
});

return {
	BinaryDropzoneMixin: BinaryDropzoneMixin,
};

});
