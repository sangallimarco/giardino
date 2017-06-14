'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const config = require('config');

/**
 * Mailer
 */
class mailer {

	constructor(fromA, subject) {
		this.fromA = fromA;
		this.subject = subject;
		this.template = '';

		// Create reusable transporter object using the default SMTP transport
		this.transporter = nodemailer.createTransport('direct');
	}

	loadTemplate(template) {
		fs.readFile(
			`${__dirname}/../templates/${template}`,
			(err, content) => {
				if (err) {
					throw err;
				}

				this.template = handlebars.compile(content.toString());
			}
		);
	}

	sendEmail(address, data) {
		let mailOptions = {
				from: this.fromA,
				to: address,
				subject: this.subject,
				html: this.template(data)
			};

		return this.transporter.sendMail(mailOptions);
	}

}

module.exports = mailer;
