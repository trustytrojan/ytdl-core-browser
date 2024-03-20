import FORMATS from './formats.js';
import * as utils from './utils.js';

export const addFormatMeta = (format) => //{
	// format = Object.assign({}, FORMATS[format.itag], format);
	Object.assign(format, FORMATS[format.itag], {
		hasVideo:   !!format.qualityLabel,
		hasAudio:   !!format.audioBitrate,
		container:  format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : null,
		codecs:     format.mimeType ? utils.between(format.mimeType, 'codecs="', '"') : null,
		videoCodec: format.hasVideo && format.codecs ? format.codecs.split(', ')[0] : null,
		audioCodec: format.hasAudio && format.codecs ? format.codecs.split(', ').slice(-1)[0] : null,
		isLive:     /\bsource[/=]yt_live_broadcast\b/.test(format.url),
		isHLS:      /\/manifest\/hls_(variant|playlist)\//.test(format.url),
		isDashMPD:  /\/manifest\/dash\//.test(format.url)
	});
	// format.hasVideo   = !!format.qualityLabel;
	// format.hasAudio   = !!format.audioBitrate;
	// format.container  = format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : null;
	// format.codecs 	  = format.mimeType ? utils.between(format.mimeType, 'codecs="', '"') : null;
	// format.videoCodec = format.hasVideo && format.codecs ? format.codecs.split(', ')[0] : null;
	// format.audioCodec = format.hasAudio && format.codecs ? format.codecs.split(', ').slice(-1)[0] : null;
	// format.isLive 	  = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
	// format.isHLS 	  = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
	// format.isDashMPD  = /\/manifest\/dash\//.test(format.url);
	// return format;
// };