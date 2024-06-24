process.on('uncaughtException', console.error);
const { default: KUNTUL, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, getContentType } = (await import('baileys')).default;
import { Boom } from '@hapi/boom';
import p from 'pino';
import cfonts from 'cfonts';
import cuy from './config.js';
import { connect } from './server.js';
const log = p({ level: 'silent' });
const PORT = process.env.PORT || 3000  

cfonts.say('auto-read-sw', {// Ubah saja cuii ;v
	font: 'tiny',       
	align: 'center',
	colors: ['system'],
	background: 'transparent', 
	letterSpacing: 1,
	lineHeight: 1,
	space: true,
	maxLength: '0',
	gradient: false,
	independentGradient: false,
	transitionGradient: false,
	env: 'node'
});
const j = async (u, c, q) => {
	const { lastDisconnect, connection } = u
   try {
      if (connection == 'close') {
      	if (new Boom(lastDisconnect.error ).output?.statusCode === DisconnectReason.loggedOut) q() 
      	else q()
      } else if (connection == 'open') {
			console.log("Tersambung ke Koneksi whatsapp...");
      }
   } catch (e) {
   	console.log('')
   }
};
const h = async (u, c) => {
	try {
		let m = u.messages[0]
		const ftrol = { key : { remoteJid: 'status@broadcast', participant : '0@s.whatsapp.net' }, message: { orderMessage: { itemCount : 2022, status: 1, surface : 1, message: cuy.name,  orderTitle: `Helo bng`, thumbnail: '', sellerJid: '0@s.whatsapp.net' } } }
		if (!m) return
		if (m.key.remoteJid === 'status@broadcast') {
			if (!cuy.autoread) return
			setTimeout(() => {
				c.readMessages([m.key])
				let mt = getContentType(m.message)
				console.log((/protocolMessage/i.test(mt)) ? `Telah menghapus Story nya : ${m.key.participant.split('@')[0]}` : 'Melihat story user : '+m.key.participant.split('@')[0]);
			}, cuy.faston);
		}
	} catch (e) {
		console.log('');
	}
}
const start = async () => {
	try {
		const store = makeInMemoryStore({ logger: log })
		const { state, saveCreds } = await useMultiFileAuthState('DB');
		const client = KUNTUL({
			browser: [cuy.name, 'safari', '1.0.0'],
			printQRInTerminal: true,
      markOnlineOnConnect: false,
			logger: log,
			auth: state
		});
		store.bind(client.ev)
		client.ev.on('connection.update', async (up) => j(up, client, start));
		client.ev.on('messages.upsert', async (up) => h(up, client));
		client.ev.on('creds.update', saveCreds);
    connect(client, PORT)
	} catch (e) {
		console.log('');
	}
};
start()
