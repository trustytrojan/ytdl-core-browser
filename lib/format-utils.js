import FORMATS from './formats.js';
import * as utils from './utils.js';

/**
 * Sort formats by a list of functions.
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Array.<Function>} sortBy
 * @returns {number}
 */
const sortFormatsBy = (a, b, sortBy) => {
	let res = 0;
	for (let fn of sortBy) {
		res = fn(b) - fn(a);
		if (res !== 0) {
			break;
		}
	}
	return res;
};

/**
 * Sort formats from highest quality to lowest.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export const sortFormats = (a, b) => sortFormatsBy(a, b, [
	// Formats with both video and audio are ranked highest.
	format => +!!format.isHLS,
	format => +!!format.isDashMPD,
	format => +(format.contentLength > 0),
	format => +(format.hasVideo && format.hasAudio),
	format => +format.hasVideo,
	format => parseInt(format.qualityLabel) || 0,
	getVideoBitrate,
	getAudioBitrate,
	getVideoEncodingRank,
	getAudioEncodingRank,
]);

export const addFormatMeta = (format) => {
	Object.assign(format, FORMATS[format.itag]);
	format.hasVideo = !!format.qualityLabel;
	format.hasAudio = !!format.audioBitrate;
	format.container = format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : null;
	format.codecs = format.mimeType ? utils.between(format.mimeType, 'codecs="', '"') : null;
	format.videoCodec = format.hasVideo && format.codecs ? format.codecs.split(', ')[0] : null;
	format.audioCodec = format.hasAudio && format.codecs ? format.codecs.split(', ').slice(-1)[0] : null;
	format.isLive = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
	format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
	format.isDashMPD = /\/manifest\/dash\//.test(format.url);
};
