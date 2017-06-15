'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const config = require('config');
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: config.get('MAILER.KEY'),
    domain: config.get('MAILER.DOMAIN')
  }
};


/**
 * Mailer
 */
class Mailer {

	constructor() {
		let transport = mailgun(auth);
		this.transporter = nodemailer.createTransport(transport);
	}

	loadTemplate(template) {
		return new Promise((resolve, reject) => {
			fs.readFile(
				`${__dirname}/../templates/${template}`,
				(err, content) => {
					if (err) {
						reject(err);
					}

					let message = handlebars.compile(content.toString());
					resolve(message);
				}
			);
		});
		
	}

	send(from, to, subject, data, templateName) {
		this.loadTemplate(templateName)
		.then(
			template => {
				let html = template(data);
				let mailOptions = {
					from,
					to,
					subject,
					html
				};

				this.transporter.sendMail(mailOptions);
			}
		);
	}

}

module.exports = Mailer;
